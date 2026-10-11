import { Router } from 'express';
import {
  RegisterInputSchema,
  LoginInputSchema,
  ChangePasswordInputSchema,
  ForgotPasswordInputSchema,
  ResetPasswordInputSchema,
  UpdateProfileInputSchema,
} from '@csf/shared';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';

export const authRouter = Router();

authRouter.post('/register', authLimiter, validateBody(RegisterInputSchema), AuthController.register);
authRouter.post('/login', authLimiter, validateBody(LoginInputSchema), AuthController.login);
authRouter.post('/refresh', AuthController.refresh);
authRouter.post('/logout', AuthController.logout);

authRouter.get('/me', authenticate, AuthController.getMe);
authRouter.patch('/me', authenticate, validateBody(UpdateProfileInputSchema), AuthController.updateMe);
authRouter.post(
  '/change-password',
  authenticate,
  validateBody(ChangePasswordInputSchema),
  AuthController.changePassword
);

authRouter.post(
  '/forgot-password',
  authLimiter,
  validateBody(ForgotPasswordInputSchema),
  AuthController.forgotPassword
);
authRouter.post(
  '/reset-password',
  authLimiter,
  validateBody(ResetPasswordInputSchema),
  AuthController.resetPassword
);

// Role authorization verification endpoint
authRouter.get('/admin-check', authenticate, authorize('ADMIN'), (_req, res) => {
  res.status(200).json({ success: true, data: { secret: 'admin_classified_data' } });
});
