import { Request, Response, NextFunction } from 'express';
import { Role } from '@csf/shared';
import { verifyAccessToken } from '../lib/jwt.js';
import { User, IUser } from '../models/User.js';
import { AppError } from './errorHandler.js';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401, 'UNAUTHORIZED'));
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId);

    if (!user) {
      return next(new AppError('User account not found or has been removed.', 401, 'UNAUTHORIZED'));
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Access token expired. Please refresh your session.', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN'));
  }
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN')
      );
    }

    next();
  };
};
