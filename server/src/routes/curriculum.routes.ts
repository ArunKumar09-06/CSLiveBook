import { Router } from 'express';
import { CurriculumController } from '../controllers/curriculum.controller.js';
import { ProgressController } from '../controllers/progress.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { SavePositionInputSchema } from '@csf/shared';

export const curriculumRouter = Router();

// Full curriculum tree
curriculumRouter.get('/curriculum', CurriculumController.getCurriculumTree);

// Subjects
curriculumRouter.get('/subjects', CurriculumController.getSubjects);
curriculumRouter.get('/subjects/:slug', CurriculumController.getSubjectBySlug);
curriculumRouter.get('/subjects/:subjectId/modules', CurriculumController.getModulesBySubject);

// Modules
curriculumRouter.get('/modules/:moduleId', CurriculumController.getModuleById);
curriculumRouter.get('/modules/:moduleId/concepts', CurriculumController.getConceptsByModule);

// Concepts
curriculumRouter.get('/concepts/slug/:slug', CurriculumController.getConceptBySlug);
curriculumRouter.get('/concepts/:conceptId', CurriculumController.getConceptById);
curriculumRouter.get('/concepts/:conceptId/content', CurriculumController.getConceptContent);
curriculumRouter.get('/concepts/:conceptId/resources', CurriculumController.getConceptResources);
curriculumRouter.get('/concepts/:conceptId/cheatsheet', CurriculumController.getConceptCheatSheet);
curriculumRouter.get('/concepts/:conceptId/related', CurriculumController.getRelatedConcepts);
curriculumRouter.get('/concepts/:conceptId/quiz', CurriculumController.getConceptQuiz);

// Learner concept actions (authenticated)
curriculumRouter.post('/concepts/:conceptId/start', authenticate, ProgressController.startConcept);
curriculumRouter.post('/concepts/:conceptId/complete', authenticate, ProgressController.completeConcept);
curriculumRouter.patch(
  '/concepts/:conceptId/position',
  authenticate,
  validateBody(SavePositionInputSchema),
  ProgressController.updatePosition
);
