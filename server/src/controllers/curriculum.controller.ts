import { Request, Response, NextFunction } from 'express';
import { CurriculumService } from '../services/curriculum.service.js';

export class CurriculumController {
  static async getCurriculumTree(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tree = await CurriculumService.getCurriculumTree();
      res.status(200).json({ success: true, data: tree });
    } catch (error) {
      next(error);
    }
  }

  static async getSubjects(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjects = await CurriculumService.getSubjects();
      res.status(200).json({ success: true, data: subjects });
    } catch (error) {
      next(error);
    }
  }

  static async getSubjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subject = await CurriculumService.getSubjectBySlug(req.params.slug);
      res.status(200).json({ success: true, data: subject });
    } catch (error) {
      next(error);
    }
  }

  static async getModulesBySubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const modules = await CurriculumService.getModulesBySubject(req.params.subjectId);
      res.status(200).json({ success: true, data: modules });
    } catch (error) {
      next(error);
    }
  }

  static async getModuleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mod = await CurriculumService.getModuleById(req.params.moduleId);
      res.status(200).json({ success: true, data: mod });
    } catch (error) {
      next(error);
    }
  }

  static async getConceptsByModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const concepts = await CurriculumService.getConceptsByModule(req.params.moduleId);
      res.status(200).json({ success: true, data: concepts });
    } catch (error) {
      next(error);
    }
  }

  static async getConceptBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const concept = await CurriculumService.getConceptBySlug(req.params.slug);
      res.status(200).json({ success: true, data: concept });
    } catch (error) {
      next(error);
    }
  }

  static async getConceptById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const concept = await CurriculumService.getConceptById(req.params.conceptId);
      res.status(200).json({ success: true, data: concept });
    } catch (error) {
      next(error);
    }
  }

  static async getConceptContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const content = await CurriculumService.getConceptContent(req.params.conceptId);
      res.status(200).json({ success: true, data: content });
    } catch (error) {
      next(error);
    }
  }

  static async getConceptResources(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resources = await CurriculumService.getConceptResources(req.params.conceptId);
      res.status(200).json({ success: true, data: resources });
    } catch (error) {
      next(error);
    }
  }

  static async getConceptCheatSheet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cheatSheet = await CurriculumService.getConceptCheatSheet(req.params.conceptId);
      res.status(200).json({ success: true, data: cheatSheet });
    } catch (error) {
      next(error);
    }
  }

  static async getRelatedConcepts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const related = await CurriculumService.getRelatedConcepts(req.params.conceptId);
      res.status(200).json({ success: true, data: related });
    } catch (error) {
      next(error);
    }
  }

  static async getConceptQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quiz = await CurriculumService.getConceptQuiz(req.params.conceptId);
      res.status(200).json({ success: true, data: quiz });
    } catch (error) {
      next(error);
    }
  }
}
