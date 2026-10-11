import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller.js';
import { authenticate } from '../middleware/auth.js';

export const assessmentRouter = Router();

// Assessment Attempt Flows (Authenticated)
assessmentRouter.post('/:assessmentId/start', authenticate, AssessmentController.startAttempt);
assessmentRouter.patch('/attempts/:attemptId/autosave', authenticate, AssessmentController.autosaveAnswer);
assessmentRouter.post('/:assessmentId/attempts', authenticate, AssessmentController.submitAttempt);
assessmentRouter.get('/attempts/:attemptId', authenticate, AssessmentController.getAttemptResult);
assessmentRouter.get('/:assessmentId/attempts/me', authenticate, AssessmentController.getUserAttempts);
