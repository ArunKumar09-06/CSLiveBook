import { Concept } from '../models/Concept.js';
import { Module } from '../models/Module.js';
import { Subject } from '../models/Subject.js';

export class SearchService {
  static async globalSearch(query: string) {
    if (!query || query.trim().length === 0) {
      return {
        subjects: [],
        modules: [],
        concepts: [],
      };
    }

    const cleanQuery = query.trim();
    const regex = new RegExp(cleanQuery, 'i');

    const [subjects, modules, concepts] = await Promise.all([
      // Search subjects
      Subject.find({
        isPublished: true,
        $or: [{ name: regex }, { description: regex }, { slug: regex }],
      })
        .limit(5)
        .lean(),

      // Search modules
      Module.find({
        isPublished: true,
        $or: [{ name: regex }, { description: regex }, { slug: regex }],
      })
        .limit(8)
        .lean(),

      // Search concepts
      Concept.find({
        isPublished: true,
        $or: [
          { conceptCode: regex },
          { title: regex },
          { description: regex },
          { tags: { $in: [regex] } },
        ],
      })
        .limit(15)
        .lean(),
    ]);

    return {
      subjects: subjects.map((s) => ({
        id: s._id,
        name: s.name,
        slug: s.slug,
        themeKey: s.themeKey,
        icon: s.icon,
      })),
      modules: modules.map((m) => ({
        id: m._id,
        name: m.name,
        slug: m.slug,
      })),
      concepts: concepts.map((c) => ({
        id: c._id,
        conceptCode: c.conceptCode,
        title: c.title,
        slug: c.slug,
        difficulty: c.difficulty,
        estimatedMinutes: c.estimatedMinutes,
        tags: c.tags,
      })),
    };
  }
}
