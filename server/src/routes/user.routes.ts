import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller.js';
import { authenticate } from '../middleware/auth.js';

export const userRouter = Router();

// Dashboard & Progress
userRouter.get('/me/dashboard', authenticate, ProgressController.getDashboard);
userRouter.get('/me/progress', authenticate, ProgressController.getUserProgress);
userRouter.get('/me/activity', authenticate, ProgressController.getActivityLog);

// Bookmarks
userRouter.get('/me/bookmarks', authenticate, ProgressController.getBookmarks);
userRouter.post('/me/bookmarks', authenticate, ProgressController.addBookmark);
userRouter.delete('/me/bookmarks/:conceptId', authenticate, ProgressController.removeBookmark);

// Notes
userRouter.get('/me/notes', authenticate, ProgressController.getNotes);
userRouter.post('/me/notes', authenticate, ProgressController.createNote);
userRouter.patch('/me/notes/:noteId', authenticate, ProgressController.updateNote);
userRouter.delete('/me/notes/:noteId', authenticate, ProgressController.deleteNote);
