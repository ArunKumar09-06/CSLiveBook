import { Types } from 'mongoose';
import { UserConceptProgress } from '../models/UserConceptProgress.js';
import { User } from '../models/User.js';
import { Concept } from '../models/Concept.js';
import { Subject } from '../models/Subject.js';
import { Module } from '../models/Module.js';
import { Bookmark } from '../models/Bookmark.js';
import { Note } from '../models/Note.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AppError } from '../middleware/errorHandler.js';

export class ProgressService {
  private static async touchActivityLog(userId: string, delta: { minutes?: number; conceptsTouched?: number; quizzesTaken?: number }) {
    const today = new Date().toISOString().split('T')[0];
    await ActivityLog.findOneAndUpdate(
      { userId, date: today },
      {
        $inc: {
          minutes: delta.minutes || 0,
          conceptsTouched: delta.conceptsTouched || 0,
          quizzesTaken: delta.quizzesTaken || 0,
        },
      },
      { upsert: true, new: true }
    );
  }

  static async startConcept(userId: string, conceptId: string) {
    const concept = await Concept.findById(conceptId);
    if (!concept) {
      throw new AppError('Concept not found', 404, 'NOT_FOUND');
    }

    const progress = await UserConceptProgress.findOneAndUpdate(
      { userId, conceptId },
      {
        $setOnInsert: {
          startedAt: new Date(),
          status: 'IN_PROGRESS',
        },
        $set: {
          lastAccessedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    await this.touchActivityLog(userId, { conceptsTouched: 1, minutes: 2 });
    return progress;
  }

  static async completeConcept(userId: string, conceptId: string) {
    const concept = await Concept.findById(conceptId);
    if (!concept) {
      throw new AppError('Concept not found', 404, 'NOT_FOUND');
    }

    const existing = await UserConceptProgress.findOne({ userId, conceptId });
    const isFirstCompletion = !existing || existing.status !== 'COMPLETED';

    const progress = await UserConceptProgress.findOneAndUpdate(
      { userId, conceptId },
      {
        $set: {
          status: 'COMPLETED',
          completedAt: new Date(),
          lastAccessedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    if (isFirstCompletion) {
      // Award 50 XP for completing a concept
      await User.findByIdAndUpdate(userId, {
        $inc: { xp: 50 },
      });
      await this.touchActivityLog(userId, { minutes: concept.estimatedMinutes || 15 });
    }

    return progress;
  }

  static async updatePosition(
    userId: string,
    conceptId: string,
    data: { lastBlockId?: string; videoPositionSec?: number }
  ) {
    const update: any = { lastAccessedAt: new Date() };
    if (data.lastBlockId) update.lastBlockId = data.lastBlockId;
    if (data.videoPositionSec !== undefined) update.videoPositionSec = data.videoPositionSec;

    const progress = await UserConceptProgress.findOneAndUpdate(
      { userId, conceptId },
      { $set: update },
      { upsert: true, new: true }
    );

    return progress;
  }

  static async getUserProgress(userId: string) {
    const totalConcepts = await Concept.countDocuments({ isPublished: true });
    const progressList = await UserConceptProgress.find({ userId }).lean();

    const completed = progressList.filter((p) => p.status === 'COMPLETED').length;
    const inProgress = progressList.filter((p) => p.status === 'IN_PROGRESS').length;
    const overallPercentage = totalConcepts > 0 ? Math.round((completed / totalConcepts) * 100) : 0;

    // Compute per-subject progress
    const subjects = await Subject.find({ isPublished: true }).sort({ order: 1 }).lean();
    const subjectProgress = await Promise.all(
      subjects.map(async (subject) => {
        const modules = await Module.find({ subjectId: subject._id, isPublished: true }).lean();
        const moduleIds = modules.map((m) => m._id);
        const subjectConcepts = await Concept.find({
          moduleId: { $in: moduleIds },
          isPublished: true,
        }).select('_id').lean();

        const subjectConceptIds = subjectConcepts.map((c) => c._id.toString());
        const completedInSubject = progressList.filter(
          (p) => p.status === 'COMPLETED' && subjectConceptIds.includes(p.conceptId.toString())
        ).length;

        const totalInSubject = subjectConceptIds.length;
        const percentage = totalInSubject > 0 ? Math.round((completedInSubject / totalInSubject) * 100) : 0;

        return {
          subjectId: subject._id,
          name: subject.name,
          slug: subject.slug,
          themeKey: subject.themeKey,
          completedCount: completedInSubject,
          totalCount: totalInSubject,
          percentage,
        };
      })
    );

    return {
      totalConcepts,
      completed,
      inProgress,
      overallPercentage,
      subjectProgress,
    };
  }

  static async getDashboard(userId: string) {
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    const progressSummary = await this.getUserProgress(userId);

    // "Continue where you left off" - most recently touched concept
    const lastProgress = await UserConceptProgress.findOne({ userId })
      .sort({ lastAccessedAt: -1 })
      .lean();

    let resumeConcept = null;
    if (lastProgress) {
      const c = await Concept.findById(lastProgress.conceptId).lean();
      if (c) {
        const mod = await Module.findById(c.moduleId).lean();
        const subject = mod ? await Subject.findById(mod.subjectId).lean() : null;
        resumeConcept = {
          ...c,
          moduleName: mod?.name,
          subjectName: subject?.name,
          subjectTheme: subject?.themeKey,
          lastBlockId: lastProgress.lastBlockId,
          videoPositionSec: lastProgress.videoPositionSec,
          status: lastProgress.status,
        };
      }
    }

    // Recommended next concepts: next unstarted concepts
    const inProgressOrDoneIds = (await UserConceptProgress.find({ userId }).select('conceptId').lean()).map(
      (p) => p.conceptId
    );

    const recommendedConcepts = await Concept.find({
      _id: { $nin: inProgressOrDoneIds },
      isPublished: true,
    })
      .sort({ order: 1 })
      .limit(3)
      .lean();

    // 7-day activity logs
    const activity = await ActivityLog.find({ userId })
      .sort({ date: -1 })
      .limit(7)
      .lean();

    const stats = {
      completedConcepts: progressSummary.completed,
      inProgressConcepts: progressSummary.inProgress,
      totalConcepts: progressSummary.totalConcepts,
      completionPercentage: progressSummary.overallPercentage,
      quizzesPassed: progressSummary.completed,
    };

    const continueLearning = resumeConcept
      ? {
          concept: {
            _id: (resumeConcept as any)._id.toString(),
            conceptCode: (resumeConcept as any).conceptCode,
            title: (resumeConcept as any).title,
            slug: (resumeConcept as any).slug,
            difficulty: (resumeConcept as any).difficulty,
            estimatedMinutes: (resumeConcept as any).estimatedMinutes,
          },
          subjectName: (resumeConcept as any).subjectName || 'DBMS & SQL',
          themeKey: (resumeConcept as any).subjectTheme || 'dbms-sql',
          lastBlockId: (resumeConcept as any).lastBlockId,
          videoPositionSec: (resumeConcept as any).videoPositionSec,
          status: (resumeConcept as any).status,
        }
      : null;

    const recommendedNext = await Promise.all(
      recommendedConcepts.map(async (c) => {
        const mod = await Module.findById(c.moduleId).lean();
        const subject = mod ? await Subject.findById(mod.subjectId).lean() : null;
        return {
          _id: c._id.toString(),
          conceptCode: c.conceptCode,
          title: c.title,
          slug: c.slug,
          subjectName: subject?.name || 'Computer Science',
          themeKey: subject?.themeKey || 'dbms-sql',
          estimatedMinutes: c.estimatedMinutes || 15,
          difficulty: c.difficulty || 'BEGINNER',
        };
      })
    );

    return {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        badges: user.badges,
      },
      stats,
      overallProgress: {
        total: progressSummary.totalConcepts,
        completed: progressSummary.completed,
        inProgress: progressSummary.inProgress,
        percentage: progressSummary.overallPercentage,
      },
      continueLearning,
      resumeConcept,
      subjectProgress: progressSummary.subjectProgress,
      recommendedConcepts,
      recommendedNext,
      recentActivity: activity.reverse(),
    };
  }

  static async getActivityLog(userId: string) {
    return ActivityLog.find({ userId }).sort({ date: -1 }).limit(30).lean();
  }

  // Bookmarks
  static async getBookmarks(userId: string) {
    const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 }).lean();
    const conceptIds = bookmarks.map((b) => b.conceptId);
    const concepts = await Concept.find({ _id: { $in: conceptIds } }).lean();

    const conceptMap = new Map(concepts.map((c) => [c._id.toString(), c]));

    return bookmarks.map((b) => ({
      id: b._id,
      conceptId: b.conceptId,
      concept: conceptMap.get(b.conceptId.toString()),
      createdAt: b.createdAt,
    }));
  }

  static async addBookmark(userId: string, conceptId: string) {
    const concept = await Concept.findById(conceptId);
    if (!concept) {
      throw new AppError('Concept not found', 404, 'NOT_FOUND');
    }

    return Bookmark.findOneAndUpdate(
      { userId, conceptId },
      { userId, conceptId },
      { upsert: true, new: true }
    );
  }

  static async removeBookmark(userId: string, conceptId: string) {
    await Bookmark.findOneAndDelete({ userId, conceptId });
  }

  // Notes
  static async getNotes(userId: string, conceptId?: string) {
    const filter: any = { userId };
    if (conceptId) {
      filter.conceptId = conceptId;
    }
    return Note.find(filter).sort({ createdAt: -1 }).lean();
  }

  static async createNote(userId: string, data: { conceptId: string; blockId?: string; text: string }) {
    const concept = await Concept.findById(data.conceptId);
    if (!concept) {
      throw new AppError('Concept not found', 404, 'NOT_FOUND');
    }

    return Note.create({
      userId,
      conceptId: data.conceptId,
      blockId: data.blockId,
      text: data.text,
    });
  }

  static async updateNote(userId: string, noteId: string, text: string) {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { $set: { text } },
      { new: true }
    );
    if (!note) {
      throw new AppError('Note not found', 404, 'NOT_FOUND');
    }
    return note;
  }

  static async deleteNote(userId: string, noteId: string) {
    const deleted = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!deleted) {
      throw new AppError('Note not found', 404, 'NOT_FOUND');
    }
  }
}
