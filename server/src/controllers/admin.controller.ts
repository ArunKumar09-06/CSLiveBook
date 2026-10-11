import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {
  static async createSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subject = await AdminService.createSubject(req.body);
      res.status(201).json({ success: true, data: subject });
    } catch (error) {
      next(error);
    }
  }

  static async updateSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subject = await AdminService.updateSubject(req.params.id, req.body);
      res.status(200).json({ success: true, data: subject });
    } catch (error) {
      next(error);
    }
  }

  static async createModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mod = await AdminService.createModule(req.body);
      res.status(201).json({ success: true, data: mod });
    } catch (error) {
      next(error);
    }
  }

  static async updateModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mod = await AdminService.updateModule(req.params.id, req.body);
      res.status(200).json({ success: true, data: mod });
    } catch (error) {
      next(error);
    }
  }

  static async createConcept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const concept = await AdminService.createConcept(req.body);
      res.status(201).json({ success: true, data: concept });
    } catch (error) {
      next(error);
    }
  }

  static async updateConcept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const concept = await AdminService.updateConcept(req.params.id, req.body);
      res.status(200).json({ success: true, data: concept });
    } catch (error) {
      next(error);
    }
  }

  static async togglePublish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;
      const concept = await AdminService.togglePublishConcept(id, isPublished);
      res.status(200).json({ success: true, data: concept });
    } catch (error) {
      next(error);
    }
  }

  static async updateContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { blocks } = req.body;
      const content = await AdminService.updateConceptContent(id, blocks || []);
      res.status(200).json({ success: true, data: content });
    } catch (error) {
      next(error);
    }
  }

  static async importMarkdown(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { markdown } = req.body;
      const content = await AdminService.importMarkdownContent(id, markdown || '');
      res.status(200).json({ success: true, data: content });
    } catch (error) {
      next(error);
    }
  }

  static async setVideoResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { conceptId } = req.params;
      const { url, chapters } = req.body;
      const resource = await AdminService.setVideoResource(conceptId, url, chapters || []);
      res.status(200).json({ success: true, data: resource });
    } catch (error) {
      next(error);
    }
  }

  static async setCheatSheetResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { conceptId } = req.params;
      const { blocks } = req.body;
      const resource = await AdminService.setCheatSheetResource(conceptId, blocks);
      res.status(200).json({ success: true, data: resource });
    } catch (error) {
      next(error);
    }
  }

  static async upsertAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { conceptId } = req.params;
      const assessment = await AdminService.upsertAssessment(conceptId, req.body);
      res.status(200).json({ success: true, data: assessment });
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await AdminService.getAnalytics();
      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }
}
