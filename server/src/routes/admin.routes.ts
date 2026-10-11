import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const adminRouter = Router();

// Protect ALL admin routes with authenticate + authorize('ADMIN')
adminRouter.use(authenticate, authorize('ADMIN'));

// Analytics
adminRouter.get('/analytics', AdminController.getAnalytics);

// Curriculum Management
adminRouter.post('/subjects', AdminController.createSubject);
adminRouter.patch('/subjects/:id', AdminController.updateSubject);

adminRouter.post('/modules', AdminController.createModule);
adminRouter.patch('/modules/:id', AdminController.updateModule);

adminRouter.post('/concepts', AdminController.createConcept);
adminRouter.patch('/concepts/:id', AdminController.updateConcept);
adminRouter.patch('/concepts/:id/publish', AdminController.togglePublish);

// Content Block Editor
adminRouter.put('/concepts/:id/content', AdminController.updateContent);
adminRouter.post('/concepts/:id/content/import-markdown', AdminController.importMarkdown);

// Resources
adminRouter.post('/resources/video/:conceptId', AdminController.setVideoResource);
adminRouter.post('/resources/cheatsheet/:conceptId', AdminController.setCheatSheetResource);

// Assessment & Questions
adminRouter.put('/assessments/concept/:conceptId', AdminController.upsertAssessment);
