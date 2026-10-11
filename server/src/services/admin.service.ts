import { Types } from 'mongoose';
import { Subject, ISubject } from '../models/Subject';
import { Module, IModule } from '../models/Module';
import { Concept, IConcept } from '../models/Concept';
import { ConceptContent } from '../models/ConceptContent';
import { ConceptResource } from '../models/ConceptResource';
import { Assessment, IAssessment, IQuestion } from '../models/Assessment';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { User } from '../models/User';
import { UserConceptProgress } from '../models/UserConceptProgress';
import { AppError } from '../middleware/errorHandler';

export interface CreateSubjectInput {
  name: string;
  slug: string;
  description: string;
  themeKey: string;
  icon?: string;
  order?: number;
  isPublished?: boolean;
}

export interface CreateModuleInput {
  subjectId: string;
  name: string;
  slug: string;
  description: string;
  order?: number;
  isPublished?: boolean;
}

export interface CreateConceptInput {
  moduleId: string;
  conceptCode: string;
  title: string;
  slug: string;
  description: string;
  estimatedMinutes?: number;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  order?: number;
  tags?: string[];
  isPublished?: boolean;
}

export class AdminService {
  /**
   * --- 1. CURRICULUM MANAGEMENT ---
   */
  static async createSubject(data: CreateSubjectInput): Promise<ISubject> {
    const existing = await Subject.findOne({ slug: data.slug });
    if (existing) {
      throw new AppError('Subject with this slug already exists', 409, 'SLUG_EXISTS');
    }
    const count = await Subject.countDocuments();
    return Subject.create({
      ...data,
      icon: data.icon || 'book-open',
      order: data.order ?? count + 1,
      isPublished: data.isPublished ?? true,
    });
  }

  static async updateSubject(id: string, update: Partial<CreateSubjectInput>): Promise<ISubject> {
    const subject = await Subject.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!subject) throw new AppError('Subject not found', 404, 'NOT_FOUND');
    return subject;
  }

  static async createModule(data: CreateModuleInput): Promise<IModule> {
    const existing = await Module.findOne({ slug: data.slug });
    if (existing) {
      throw new AppError('Module with this slug already exists', 409, 'SLUG_EXISTS');
    }
    const count = await Module.countDocuments({ subjectId: data.subjectId });
    return Module.create({
      ...data,
      subjectId: new Types.ObjectId(data.subjectId),
      order: data.order ?? count + 1,
      isPublished: data.isPublished ?? true,
    });
  }

  static async updateModule(id: string, update: Partial<CreateModuleInput>): Promise<IModule> {
    const mod = await Module.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!mod) throw new AppError('Module not found', 404, 'NOT_FOUND');
    return mod;
  }

  static async createConcept(data: CreateConceptInput): Promise<IConcept> {
    const existing = await Concept.findOne({ slug: data.slug });
    if (existing) {
      throw new AppError('Concept with this slug already exists', 409, 'SLUG_EXISTS');
    }
    const count = await Concept.countDocuments({ moduleId: data.moduleId });
    const concept = await Concept.create({
      ...data,
      moduleId: new Types.ObjectId(data.moduleId),
      order: data.order ?? count + 1,
      isPublished: data.isPublished ?? true,
    });

    // Initialize empty content container
    await ConceptContent.create({
      conceptId: concept._id,
      version: 1,
      blocks: [
        {
          type: 'heading',
          id: 'overview',
          level: 1,
          text: data.title,
        },
        {
          type: 'text',
          id: 'intro',
          markdown: data.description,
        },
      ],
      tableOfContents: [
        { id: 'overview', text: data.title, level: 1 },
      ],
    });

    return concept;
  }

  static async updateConcept(id: string, update: Partial<CreateConceptInput>): Promise<IConcept> {
    const concept = await Concept.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!concept) throw new AppError('Concept not found', 404, 'NOT_FOUND');
    return concept;
  }

  static async togglePublishConcept(id: string, isPublished: boolean): Promise<IConcept> {
    const concept = await Concept.findByIdAndUpdate(id, { isPublished }, { new: true });
    if (!concept) throw new AppError('Concept not found', 404, 'NOT_FOUND');
    return concept;
  }

  /**
   * --- 2. CONTENT BLOCK EDITOR ---
   */
  static async updateConceptContent(conceptId: string, blocks: unknown[]): Promise<unknown> {
    let content = await ConceptContent.findOne({ conceptId });
    if (!content) {
      content = new ConceptContent({
        conceptId: new Types.ObjectId(conceptId),
        version: 1,
        blocks: [],
      });
    }

    // Extract Headings for TOC
    const tableOfContents = (blocks as Array<{ type: string; id?: string; text?: string; level?: number }>)
      .filter((b) => b.type === 'heading' && b.text)
      .map((b) => ({
        id: b.id || b.text!.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        text: b.text!,
        level: b.level || 2,
      }));

    content.blocks = blocks;
    content.version = (content.version || 1) + 1;
    content.tableOfContents = tableOfContents;
    await content.save();

    return content;
  }

  static async importMarkdownContent(conceptId: string, markdown: string): Promise<unknown> {
    const lines = markdown.split('\n');
    const blocks: unknown[] = [];
    let currentParagraph: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        blocks.push({
          type: 'text',
          id: `p-${blocks.length}`,
          markdown: currentParagraph.join('\n').trim(),
        });
        currentParagraph = [];
      }
    };

    for (const line of lines) {
      if (line.startsWith('# ')) {
        flushParagraph();
        blocks.push({
          type: 'heading',
          id: `h1-${blocks.length}`,
          level: 1,
          text: line.replace('# ', '').trim(),
        });
      } else if (line.startsWith('## ')) {
        flushParagraph();
        blocks.push({
          type: 'heading',
          id: `h2-${blocks.length}`,
          level: 2,
          text: line.replace('## ', '').trim(),
        });
      } else if (line.startsWith('### ')) {
        flushParagraph();
        blocks.push({
          type: 'heading',
          id: `h3-${blocks.length}`,
          level: 3,
          text: line.replace('### ', '').trim(),
        });
      } else {
        currentParagraph.push(line);
      }
    }
    flushParagraph();

    return this.updateConceptContent(conceptId, blocks);
  }

  /**
   * --- 3. RESOURCE MANAGER ---
   */
  static async setVideoResource(
    conceptId: string,
    content: string,
    chapters: Array<{ title: string; timeSec: number }> = []
  ) {
    return ConceptResource.findOneAndUpdate(
      { conceptId: new Types.ObjectId(conceptId), type: 'VIDEO' },
      {
        conceptId: new Types.ObjectId(conceptId),
        type: 'VIDEO',
        source: content.startsWith('http') ? 'URL' : 'UPLOAD',
        content,
        metadata: { chapters },
        isPublished: true,
      },
      { upsert: true, new: true }
    );
  }

  static async setCheatSheetResource(
    conceptId: string,
    blocksData: unknown
  ) {
    return ConceptResource.findOneAndUpdate(
      { conceptId: new Types.ObjectId(conceptId), type: 'CHEAT_SHEET' },
      {
        conceptId: new Types.ObjectId(conceptId),
        type: 'CHEAT_SHEET',
        source: 'JSON_BLOCKS',
        content: JSON.stringify(blocksData),
        isPublished: true,
      },
      { upsert: true, new: true }
    );
  }

  /**
   * --- 4. ASSESSMENT & QUESTION EDITOR ---
   */
  static async upsertAssessment(
    conceptId: string,
    data: {
      title: string;
      passingScore?: number;
      timeLimit?: number;
      questions: IQuestion[];
    }
  ): Promise<IAssessment> {
    const existing = await Assessment.findOne({ conceptId });
    if (existing) {
      existing.title = data.title;
      if (data.passingScore) existing.passingScore = data.passingScore;
      if (data.timeLimit) existing.timeLimit = data.timeLimit;
      existing.questions = data.questions;
      await existing.save();
      return existing;
    }

    return Assessment.create({
      conceptId: new Types.ObjectId(conceptId),
      type: 'CONCEPT_QUIZ',
      title: data.title,
      passingScore: data.passingScore || 80,
      timeLimit: data.timeLimit || 600,
      isPublished: true,
      questions: data.questions,
    });
  }

  /**
   * --- 5. ANALYTICS DASHBOARD ---
   */
  static async getAnalytics(): Promise<unknown> {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'STUDENT' });
    const totalConcepts = await Concept.countDocuments();
    const completedProgressCount = await UserConceptProgress.countDocuments({ status: 'COMPLETED' });
    const totalAttempts = await AssessmentAttempt.countDocuments();
    const passedAttempts = await AssessmentAttempt.countDocuments({
      status: 'EVALUATED',
      score: { $gte: 70 },
    });

    // Recent signups
    const recentSignups = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    // Hardest concepts by average quiz score
    const conceptScores = await AssessmentAttempt.aggregate([
      { $match: { status: 'EVALUATED' } },
      {
        $group: {
          _id: '$assessmentId',
          avgScore: { $avg: '$score' },
          attempts: { $sum: 1 },
        },
      },
      { $sort: { avgScore: 1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'assessments',
          localField: '_id',
          foreignField: '_id',
          as: 'assessment',
        },
      },
      { $unwind: '$assessment' },
    ]);

    return {
      metrics: {
        totalUsers,
        students,
        totalConcepts,
        conceptsCompleted: completedProgressCount,
        totalAttempts,
        passedAttempts,
        passRate: totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0,
      },
      recentSignups,
      hardestAssessments: conceptScores.map((c) => ({
        assessmentId: c._id,
        title: c.assessment.title,
        avgScore: Math.round(c.avgScore),
        attempts: c.attempts,
      })),
    };
  }
}
