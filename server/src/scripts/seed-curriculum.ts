import { connectDB, disconnectDB } from '../config/database.js';
import { Subject, Module, Concept } from '../models/index.js';
import { CURRICULUM_DATA } from './curriculum-data.js';

export const seedCurriculum = async () => {
  console.log('🌱 Starting curriculum database seed...');
  await connectDB();

  let totalSubjects = 0;
  let totalModules = 0;
  let totalConcepts = 0;

  for (let sIdx = 0; sIdx < CURRICULUM_DATA.length; sIdx++) {
    const sData = CURRICULUM_DATA[sIdx];
    const subject = await Subject.findOneAndUpdate(
      { slug: sData.slug },
      {
        name: sData.name,
        slug: sData.slug,
        description: sData.description,
        icon: sData.icon,
        themeKey: sData.themeKey,
        order: sIdx,
        isPublished: true,
      },
      { upsert: true, new: true }
    );
    totalSubjects++;

    for (let mIdx = 0; mIdx < sData.modules.length; mIdx++) {
      const mData = sData.modules[mIdx];
      const module = await Module.findOneAndUpdate(
        { slug: mData.slug },
        {
          subjectId: subject._id,
          name: mData.name,
          slug: mData.slug,
          description: mData.description,
          order: mIdx,
          isPublished: true,
        },
        { upsert: true, new: true }
      );
      totalModules++;

      for (let cIdx = 0; cIdx < mData.concepts.length; cIdx++) {
        const cData = mData.concepts[cIdx];
        await Concept.findOneAndUpdate(
          { slug: cData.slug },
          {
            moduleId: module._id,
            conceptCode: cData.conceptCode,
            title: cData.title,
            slug: cData.slug,
            description: cData.description,
            estimatedMinutes: cData.estimatedMinutes,
            difficulty: cData.difficulty,
            tags: cData.tags,
            order: cIdx,
            isPublished: true,
          },
          { upsert: true, new: true }
        );
        totalConcepts++;
      }
    }
  }

  console.log(
    `✅ Curriculum seeded successfully: ${totalSubjects} Subjects, ${totalModules} Modules, ${totalConcepts} Concepts.`
  );
};

// If run directly
if (process.argv[1]?.includes('seed-curriculum')) {
  seedCurriculum()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Failed to seed curriculum:', err);
      process.exit(1);
    });
}
