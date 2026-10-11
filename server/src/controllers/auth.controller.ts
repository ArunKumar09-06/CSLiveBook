import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { AuthService } from '../services/auth.service.js';

const isProduction = env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', COOKIE_OPTIONS);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = { userAgent: req.headers['user-agent'], ip: req.ip };
      const { user, accessToken, refreshToken } = await AuthService.register(req.body, meta);
      setAuthCookies(res, accessToken, refreshToken);

      res.status(201).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = { userAgent: req.headers['user-agent'], ip: req.ip };
      const { user, accessToken, refreshToken } = await AuthService.login(req.body, meta);
      setAuthCookies(res, accessToken, refreshToken);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawRefreshToken = req.cookies?.refreshToken;
      const meta = { userAgent: req.headers['user-agent'], ip: req.ip };
      const { user, accessToken, refreshToken } = await AuthService.refreshTokens(
        rawRefreshToken,
        meta
      );
      setAuthCookies(res, accessToken, refreshToken);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      clearAuthCookies(res);
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawRefreshToken = req.cookies?.refreshToken;
      await AuthService.logout(rawRefreshToken);
      clearAuthCookies(res);

      res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully' },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  }

  static async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedUser = await AuthService.updateProfile(req.user!._id.toString(), req.body);
      res.status(200).json({
        success: true,
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.changePassword(req.user!._id.toString(), req.body);
      clearAuthCookies(res);

      res.status(200).json({
        success: true,
        data: { message: 'Password changed successfully. Please log in with your new password.' },
      });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.forgotPassword(req.body.email);
      res.status(200).json({
        success: true,
        data: {
          message: 'If an account with that email exists, password reset instructions have been dispatched.',
          // In development or test, include the token for convenience
          ...(env.NODE_ENV !== 'production' ? { resetToken: result.resetToken } : {}),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.resetPassword(req.body.token, req.body.newPassword);
      clearAuthCookies(res);

      res.status(200).json({
        success: true,
        data: { message: 'Password has been reset successfully. Please log in with your new password.' },
      });
    } catch (error) {
      next(error);
    }
  }
}
