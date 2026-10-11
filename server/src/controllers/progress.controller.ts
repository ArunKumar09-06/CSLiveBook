import { Request, Response, NextFunction } from 'express';
import { ProgressService } from '../services/progress.service.js';

export class ProgressController {
  static async startConcept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const progress = await ProgressService.startConcept(
        req.user!._id.toString(),
        req.params.conceptId
      );
      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      next(error);
    }
  }

  static async completeConcept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const progress = await ProgressService.completeConcept(
        req.user!._id.toString(),
        req.params.conceptId
      );
      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      next(error);
    }
  }

  static async updatePosition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const progress = await ProgressService.updatePosition(
        req.user!._id.toString(),
        req.params.conceptId,
        req.body
      );
      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      next(error);
    }
  }

  static async getUserProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const progress = await ProgressService.getUserProgress(req.user!._id.toString());
      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dashboard = await ProgressService.getDashboard(req.user!._id.toString());
      res.status(200).json({ success: true, data: dashboard });
    } catch (error) {
      next(error);
    }
  }

  static async getActivityLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await ProgressService.getActivityLog(req.user!._id.toString());
      res.status(200).json({ success: true, data: activity });
    } catch (error) {
      next(error);
    }
  }

  // Bookmarks
  static async getBookmarks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookmarks = await ProgressService.getBookmarks(req.user!._id.toString());
      res.status(200).json({ success: true, data: bookmarks });
    } catch (error) {
      next(error);
    }
  }

  static async addBookmark(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookmark = await ProgressService.addBookmark(
        req.user!._id.toString(),
        req.body.conceptId
      );
      res.status(201).json({ success: true, data: bookmark });
    } catch (error) {
      next(error);
    }
  }

  static async removeBookmark(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ProgressService.removeBookmark(req.user!._id.toString(), req.params.conceptId);
      res.status(200).json({ success: true, data: { message: 'Bookmark removed' } });
    } catch (error) {
      next(error);
    }
  }

  // Notes
  static async getNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notes = await ProgressService.getNotes(
        req.user!._id.toString(),
        req.query.conceptId as string
      );
      res.status(200).json({ success: true, data: notes });
    } catch (error) {
      next(error);
    }
  }

  static async createNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const note = await ProgressService.createNote(req.user!._id.toString(), req.body);
      res.status(201).json({ success: true, data: note });
    } catch (error) {
      next(error);
    }
  }

  static async updateNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const note = await ProgressService.updateNote(
        req.user!._id.toString(),
        req.params.noteId,
        req.body.text
      );
      res.status(200).json({ success: true, data: note });
    } catch (error) {
      next(error);
    }
  }

  static async deleteNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ProgressService.deleteNote(req.user!._id.toString(), req.params.noteId);
      res.status(200).json({ success: true, data: { message: 'Note deleted' } });
    } catch (error) {
      next(error);
    }
  }
}
