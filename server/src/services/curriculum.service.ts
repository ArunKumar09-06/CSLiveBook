import { Subject } from '../models/Subject.js';
import { Module } from '../models/Module.js';
import { Concept } from '../models/Concept.js';
import { ConceptContent } from '../models/ConceptContent.js';
import { ConceptResource } from '../models/ConceptResource.js';
import { Assessment } from '../models/Assessment.js';
import { AppError } from '../middleware/errorHandler.js';

interface CacheEntry {
  data: any;
  timestamp: number;
}

let curriculumCache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export class CurriculumService {
  /**
   * Invalidate the in-memory curriculum cache
   */
  static invalidateCache() {
    curriculumCache = null;
  }

  /**
   * Returns full Subject -> Module -> Concept tree in one single optimized aggregation.
   */
  static async getCurriculumTree() {
    if (curriculumCache && Date.now() - curriculumCache.timestamp < CACHE_TTL_MS) {
      return curriculumCache.data;
    }

    const tree = await Subject.aggregate([
      { $match: { isPublished: true } },
      { $sort: { order: 1 } },
      {
        $lookup: {
          from: 'modules',
          let: { subjectId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$subjectId', '$$subjectId'] }, { $eq: ['$isPublished', true] }],
                },
              },
            },
            { $sort: { order: 1 } },
            {
              $lookup: {
                from: 'concepts',
                let: { moduleId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$moduleId', '$$moduleId'] }, { $eq: ['$isPublished', true] }],
                      },
                    },
                  },
                  { $sort: { order: 1 } },
                  {
                    $project: {
                      conceptCode: 1,
                      title: 1,
                      slug: 1,
                      description: 1,
                      estimatedMinutes: 1,
                      difficulty: 1,
                      tags: 1,
                      order: 1,
                    },
                  },
                ],
                as: 'concepts',
              },
            },
          ],
          as: 'modules',
        },
      },
    ]);

    curriculumCache = {
      data: tree,
      timestamp: Date.now(),
    };

    return tree;
  }

  static async getSubjects() {
    const subjects = await Subject.find({ isPublished: true }).sort({ order: 1 }).lean();

    // Enrich with module count and concept count
    const enriched = await Promise.all(
      subjects.map(async (subject) => {
        const modules = await Module.find({ subjectId: subject._id, isPublished: true }).lean();
        const moduleIds = modules.map((m) => m._id);
        const conceptCount = await Concept.countDocuments({
          moduleId: { $in: moduleIds },
          isPublished: true,
        });

        return {
          ...subject,
          moduleCount: modules.length,
          conceptCount,
        };
      })
    );

    return enriched;
  }

  static async getSubjectBySlug(slug: string) {
    const subject = await Subject.findOne({ slug, isPublished: true }).lean();
    if (!subject) {
      throw new AppError('Subject not found', 404, 'NOT_FOUND');
    }

    const modules = await Module.find({ subjectId: subject._id, isPublished: true })
      .sort({ order: 1 })
      .lean();

    const modulesWithConcepts = await Promise.all(
      modules.map(async (mod) => {
        const concepts = await Concept.find({ moduleId: mod._id, isPublished: true })
          .sort({ order: 1 })
          .select('-__v')
          .lean();
        return {
          ...mod,
          concepts,
        };
      })
    );

    return {
      ...subject,
      modules: modulesWithConcepts,
    };
  }

  static async getModulesBySubject(subjectId: string) {
    return Module.find({ subjectId, isPublished: true }).sort({ order: 1 }).lean();
  }

  static async getModuleById(moduleId: string) {
    const mod = await Module.findOne({ _id: moduleId, isPublished: true }).lean();
    if (!mod) {
      throw new AppError('Module not found', 404, 'NOT_FOUND');
    }
    const concepts = await Concept.find({ moduleId: mod._id, isPublished: true })
      .sort({ order: 1 })
      .lean();

    return {
      ...mod,
      concepts,
    };
  }

  static async getConceptsByModule(moduleId: string) {
    return Concept.find({ moduleId, isPublished: true }).sort({ order: 1 }).lean();
  }

  static async getConceptBySlug(slug: string) {
    let concept = await Concept.findOne({ slug, isPublished: true }).lean();
    if (!concept && (slug === 'c1-dbms-vs-file-system' || slug === 'c1')) {
      concept = await Concept.findOne({
        $or: [{ conceptCode: 'C1' }, { slug: 'dbms-vs-file-system-dbms-vs-rdbms' }],
        isPublished: true,
      }).lean();
    }
    if (!concept) {
      throw new AppError('Concept not found', 404, 'NOT_FOUND');
    }

    // Include module & subject metadata for breadcrumbs
    const mod = await Module.findById(concept.moduleId).lean();
    const subject = mod ? await Subject.findById(mod.subjectId).lean() : null;

    return {
      ...concept,
      module: mod
        ? {
            id: mod._id,
            name: mod.name,
            slug: mod.slug,
          }
        : null,
      subject: subject
        ? {
            id: subject._id,
            name: subject.name,
            slug: subject.slug,
            themeKey: subject.themeKey,
          }
        : null,
    };
  }

  static async getConceptById(conceptId: string) {
    const concept = await Concept.findOne({ _id: conceptId, isPublished: true }).lean();
    if (!concept) {
      throw new AppError('Concept not found', 404, 'NOT_FOUND');
    }
    return concept;
  }

  static async getConceptContent(conceptId: string) {
    const content = await ConceptContent.findOne({ conceptId }).lean();
    if (content && content.blocks && content.blocks.length > 0) {
      return content;
    }

    const concept = await Concept.findById(conceptId).lean();
    if (!concept) {
      return {
        conceptId,
        blocks: [],
        version: 1,
        tableOfContents: [],
      };
    }

    const defaultBlocks = [
      {
        id: `b-h1-${concept._id}`,
        type: 'heading',
        level: 1,
        text: `${concept.conceptCode}: ${concept.title}`,
      },
      {
        id: `b-callout-${concept._id}`,
        type: 'callout',
        variant: 'info',
        title: 'Core Interview Syllabus Focus',
        content: concept.description,
      },
      {
        id: `b-text-${concept._id}`,
        type: 'text',
        content: `### Architecture & Engineering Mechanics\n\nIn technical interviews, **${concept.title}** evaluates foundational system design and algorithmic depth. Key considerations include invariant enforcement, operational overhead, and scalability under real-world concurrent workloads.`,
      },
      {
        id: `b-iq-${concept._id}`,
        type: 'interview_question',
        question: `How would you explain the core mechanism and design rationale behind ${concept.title}?`,
        frequency: 'VERY_HIGH',
        modelAnswer: `When explaining ${concept.title}, distinguish the logical contract from the underlying physical storage or execution model. Focus on latency, memory footprint, data integrity, and failure recovery protocols.`,
        followUps: [
          {
            question: `What anomalies or bottlenecks occur if this invariant is violated in high-throughput systems?`,
            answer: `System failures such as race conditions, resource contention, cache thrashing, or cascading aborts emerge. Robust implementations enforce explicit bounds, transaction logs, and fallback protocols.`,
          },
        ],
      },
      {
        id: `b-recap-${concept._id}`,
        type: 'recap',
        title: `High-Yield Takeaways for ${concept.conceptCode}`,
        keyPoints: [
          `Master the primary definitions and requirements of ${concept.title}.`,
          `Be ready to write or trace production scenarios on a whiteboard or virtual IDE.`,
          `Highlight trade-offs between simplicity and scalability during technical discussions.`,
        ],
      },
    ];

    const tableOfContents = [
      { id: `b-h1-${concept._id}`, text: `${concept.conceptCode}: ${concept.title}`, level: 1 },
      { id: `b-text-${concept._id}`, text: 'Architecture & Engineering Mechanics', level: 2 },
      { id: `b-iq-${concept._id}`, text: 'Interview Preparation', level: 2 },
      { id: `b-recap-${concept._id}`, text: 'High-Yield Takeaways', level: 2 },
    ];

    return {
      conceptId,
      blocks: defaultBlocks,
      version: 1,
      tableOfContents,
    };
  }

  static async getConceptResources(conceptId: string) {
    return ConceptResource.find({ conceptId, isPublished: true }).lean();
  }

  static async getConceptCheatSheet(conceptId: string) {
    const resource = await ConceptResource.findOne({
      conceptId,
      type: 'CHEAT_SHEET',
      isPublished: true,
    }).lean();

    if (!resource) {
      throw new AppError('Cheat sheet not found for this concept', 404, 'NOT_FOUND');
    }

    let parsedContent = resource.content;
    if (resource.source === 'JSON_BLOCKS') {
      try {
        parsedContent = JSON.parse(resource.content);
      } catch {
        // Keep as string if parsing fails
      }
    }

    return {
      ...resource,
      content: parsedContent,
    };
  }

  static async getRelatedConcepts(conceptId: string) {
    const current = await Concept.findById(conceptId).lean();
    if (!current) {
      throw new AppError('Concept not found', 404, 'NOT_FOUND');
    }

    const previousConcept = await Concept.findOne({
      moduleId: current.moduleId,
      order: { $lt: current.order },
      isPublished: true,
    })
      .sort({ order: -1 })
      .lean();

    const nextConcept = await Concept.findOne({
      moduleId: current.moduleId,
      order: { $gt: current.order },
      isPublished: true,
    })
      .sort({ order: 1 })
      .lean();

    return {
      previous: previousConcept
        ? {
            id: previousConcept._id,
            conceptCode: previousConcept.conceptCode,
            title: previousConcept.title,
            slug: previousConcept.slug,
          }
        : null,
      next: nextConcept
        ? {
            id: nextConcept._id,
            conceptCode: nextConcept.conceptCode,
            title: nextConcept.title,
            slug: nextConcept.slug,
          }
        : null,
    };
  }

  /**
   * CRITICAL SECURITY RULE:
   * Returns concept assessment questions WITHOUT correctAnswer or explanation.
   */
  static async getConceptQuiz(conceptId: string) {
    const assessment = await Assessment.findOne({
      conceptId,
      type: 'CONCEPT_QUIZ',
      isPublished: true,
    }).lean();

    if (!assessment) {
      throw new AppError('Quiz not found for this concept', 404, 'NOT_FOUND');
    }

    // Sanitize questions: strip correctAnswer and explanation for learners
    const publicQuestions = assessment.questions.map((q: any) => ({
      id: q._id.toString(),
      type: q.type,
      prompt: q.prompt,
      options: q.options,
      points: q.points,
      order: q.order,
      tags: q.tags,
      learningObjective: q.learningObjective,
    }));

    return {
      id: assessment._id.toString(),
      conceptId: assessment.conceptId?.toString(),
      type: assessment.type,
      title: assessment.title,
      description: assessment.description,
      timeLimit: assessment.timeLimit,
      passingScore: assessment.passingScore,
      questions: publicQuestions,
    };
  }
}
