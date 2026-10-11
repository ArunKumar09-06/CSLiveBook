import { describe, expect, it } from 'vitest';
import { Assessment, User } from '../models/index.js';
import { CURRICULUM_DATA } from '../scripts/curriculum-data.js';

describe('Data Models & Security Invariants', () => {
  it('User model should NOT select passwordHash by default', async () => {
    const user = await User.create({
      name: 'Security Test User',
      email: 'test_sec@csflivebook.com',
      passwordHash: 'secret_hash_value_123',
      role: 'STUDENT',
    });

    // Query user without explicitly selecting passwordHash
    const retrieved = await User.findById(user._id).lean();
    expect(retrieved).toBeDefined();
    expect((retrieved as any).passwordHash).toBeUndefined();
  });

  it('Assessment model questions should NEVER leak correctAnswer by default', async () => {
    const assessment = await Assessment.create({
      title: 'Security Projection Quiz',
      type: 'CONCEPT_QUIZ',
      questions: [
        {
          type: 'MCQ',
          prompt: 'What is 2 + 2?',
          options: [
            { id: 'a', text: '3' },
            { id: 'b', text: '4' },
          ],
          correctAnswer: 'b',
          explanation: '2 plus 2 equals 4',
          points: 1,
          order: 0,
        },
      ],
    });

    // Default query as issued by learner endpoints
    const retrieved = await Assessment.findById(assessment._id).lean();
    expect(retrieved).toBeDefined();
    expect(retrieved?.questions[0]).toBeDefined();
    // CRITICAL: correctAnswer must NOT be present
    expect((retrieved?.questions[0] as any).correctAnswer).toBeUndefined();
    expect(retrieved?.questions[0].prompt).toBe('What is 2 + 2?');
  });

  it('Curriculum matrix must contain exactly 8 subjects, 42 modules, and 184 concepts', () => {
    const totalSubjects = CURRICULUM_DATA.length;
    let totalModules = 0;
    let totalConcepts = 0;

    for (const subject of CURRICULUM_DATA) {
      totalModules += subject.modules.length;
      for (const module of subject.modules) {
        totalConcepts += module.concepts.length;
      }
    }

    expect(totalSubjects).toBe(8);
    expect(totalModules).toBe(42);
    expect(totalConcepts).toBe(184);
  });
});
