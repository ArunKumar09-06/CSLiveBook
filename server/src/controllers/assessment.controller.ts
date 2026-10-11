import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from '../services/assessment.service.js';

export class AssessmentController {
  static async startAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { assessmentId } = req.params;
      const attempt = await AssessmentService.startAttempt(userId, assessmentId);
      res.status(201).json({
        success: true,
        data: attempt,
      });
    } catch (error) {
      next(error);
    }
  }

  static async autosaveAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { attemptId } = req.params;
      const { questionId, response } = req.body;
      await AssessmentService.autosaveAnswer(userId, attemptId, questionId, response);
      res.status(200).json({
        success: true,
        data: { saved: true },
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { assessmentId } = req.params;
      const { answers, attemptId } = req.body;
      const result = await AssessmentService.submitAttempt(
        userId,
        assessmentId,
        answers || [],
        attemptId
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAttemptResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { attemptId } = req.params;
      const result = await AssessmentService.getAttemptResult(userId, attemptId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserAttempts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { assessmentId } = req.params;
      const attempts = await AssessmentService.getUserAttempts(userId, assessmentId);
      res.status(200).json({
        success: true,
        data: attempts,
      });
    } catch (error) {
      next(error);
    }
  }
}
