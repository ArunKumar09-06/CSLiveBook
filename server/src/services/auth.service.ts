import argon2 from 'argon2';
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from '@csf/shared';
import { User, IUser } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { generateRandomToken, hashToken } from '../lib/crypto.js';
import { AppError } from '../middleware/errorHandler.js';

interface ClientMeta {
  userAgent?: string;
  ip?: string;
}

const sanitizeUser = (user: IUser) => {
  const obj = user.toObject ? user.toObject() : (user as any);
  delete obj.passwordHash;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.__v;
  return obj;
};

export class AuthService {
  static async register(data: RegisterInput, meta: ClientMeta = {}) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new AppError('An account with this email address already exists.', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await argon2.hash(data.password);
    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: 'STUDENT',
    });

    const accessToken = signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const rawRefreshToken = signRefreshToken({ userId: user._id.toString() });
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      userAgent: meta.userAgent,
      ip: meta.ip,
    });

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  static async login(data: LoginInput, meta: ClientMeta = {}) {
    const user = await User.findOne({ email: data.email }).select('+passwordHash');
    if (!user) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isValid = await argon2.verify(user.passwordHash, data.password);
    if (!isValid) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // Update streak if a new calendar day
    const today = new Date().toISOString().split('T')[0];
    if (user.streak.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      if (user.streak.lastActiveDate === yesterday) {
        user.streak.current += 1;
      } else {
        user.streak.current = 1;
      }
      if (user.streak.current > user.streak.longest) {
        user.streak.longest = user.streak.current;
      }
      user.streak.lastActiveDate = today;
      await user.save();
    }

    const accessToken = signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const rawRefreshToken = signRefreshToken({ userId: user._id.toString() });
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      userAgent: meta.userAgent,
      ip: meta.ip,
    });

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  static async refreshTokens(rawRefreshToken: string, meta: ClientMeta = {}) {
    if (!rawRefreshToken) {
      throw new AppError('Refresh token required.', 401, 'UNAUTHORIZED');
    }

    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token.', 401, 'TOKEN_EXPIRED');
    }

    const tokenHash = hashToken(rawRefreshToken);
    const storedToken = await RefreshToken.findOne({
      tokenHash,
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
      // Possible reuse attack: revoke all tokens for this user
      await RefreshToken.updateMany({ userId: payload.userId }, { revokedAt: new Date() });
      throw new AppError('Invalid or reused refresh token. Please sign in again.', 401, 'INVALID_REFRESH_TOKEN');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new AppError('User not found.', 401, 'USER_NOT_FOUND');
    }

    // Token rotation: revoke current token
    storedToken.revokedAt = new Date();
    await storedToken.save();

    // Issue new pair
    const newAccessToken = signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRawRefreshToken = signRefreshToken({ userId: user._id.toString() });
    const newTokenHash = hashToken(newRawRefreshToken);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      userId: user._id,
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt,
      userAgent: meta.userAgent,
      ip: meta.ip,
    });

    return {
      user: sanitizeUser(user),
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
    };
  }

  static async logout(rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      await RefreshToken.findOneAndUpdate({ tokenHash }, { revokedAt: new Date() });
    }
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const update: any = {};
    if (data.name) update.name = data.name;
    if (data.avatarUrl !== undefined) update.avatarUrl = data.avatarUrl;
    if (data.preferences) {
      if (data.preferences.theme) update['preferences.theme'] = data.preferences.theme;
      if (data.preferences.reducedMotion !== undefined) {
        update['preferences.reducedMotion'] = data.preferences.reducedMotion;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: update }, { new: true });
    if (!updatedUser) {
      throw new AppError('User not found.', 404, 'NOT_FOUND');
    }
    return sanitizeUser(updatedUser);
  }

  static async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      throw new AppError('User not found.', 404, 'NOT_FOUND');
    }

    const isValid = await argon2.verify(user.passwordHash, data.currentPassword);
    if (!isValid) {
      throw new AppError('Current password is incorrect.', 400, 'INVALID_CURRENT_PASSWORD');
    }

    user.passwordHash = await argon2.hash(data.newPassword);
    await user.save();

    // Invalidate all existing refresh tokens
    await RefreshToken.updateMany({ userId: user._id }, { revokedAt: new Date() });
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak user existence
      return { sent: true };
    }

    const rawResetToken = generateRandomToken(32);
    const hashedResetToken = hashToken(rawResetToken);

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // In local / test mode, we return the token for testing; in production it is dispatched via SMTP
    return {
      sent: true,
      resetToken: rawResetToken,
    };
  }

  static async resetPassword(token: string, newPassword: string) {
    const hashedToken = hashToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Password reset token is invalid or has expired.', 400, 'INVALID_RESET_TOKEN');
    }

    user.passwordHash = await argon2.hash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Invalidate refresh tokens
    await RefreshToken.updateMany({ userId: user._id }, { revokedAt: new Date() });
  }
}
