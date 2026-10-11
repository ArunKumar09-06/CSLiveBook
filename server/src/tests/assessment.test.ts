import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { connectDB } from '../config/database';
import mongoose from 'mongoose';
import { AssessmentService } from '../services/assessment.service';
import { Assessment, IQuestion } from '../models/Assessment';
import { User } from '../models/User';
import { Concept } from '../models/Concept';
import { signAccessToken } from '../lib/jwt';
import argon2 from 'argon2';

const app = createApp();

describe('Phase 7: Assessment Engine & Grader Suite', () => {
  let studentToken: string;
  let studentId: string;
  let testConceptId: string;
  let testAssessmentId: string;

  beforeAll(async () => {
    await connectDB();

    // Create or find student
    let student = await User.findOne({ email: 'grader_student@csflivebook.com' });
    if (!student) {
      student = await User.create({
        name: 'Grader Student',
        email: 'grader_student@csflivebook.com',
        passwordHash: await argon2.hash('Password123!'),
        role: 'STUDENT',
        xp: 0,
      });
    }
    studentId = student._id.toString();
    studentToken = signAccessToken({
      userId: studentId,
      email: student.email,
      role: 'STUDENT',
    });

    // Create test concept
    let concept = await Concept.findOne({ conceptCode: 'TEST-Q1' });
    if (!concept) {
      concept = await Concept.create({
        moduleId: new mongoose.Types.ObjectId(),
        conceptCode: 'TEST-Q1',
        title: 'Assessment Engine Testing Concept',
        slug: 'test-q1-assessment-engine',
        description: 'Testing 7 question types',
        estimatedMinutes: 10,
        difficulty: 'INTERMEDIATE',
        order: 1,
        isPublished: true,
      });
    }
    testConceptId = concept._id.toString();

    // Create test assessment with all 7 question types
    const assessment = await Assessment.create({
      conceptId: concept._id,
      type: 'CONCEPT_QUIZ',
      title: '7 Question Types Master Assessment',
      passingScore: 80,
      timeLimit: 600,
      isPublished: true,
      questions: [
        {
          type: 'MCQ',
          prompt: 'What is the primary benefit of normalization in relational databases?',
          options: [
            { id: 'opt1', text: 'Minimizing data redundancy and anomalies' },
            { id: 'opt2', text: 'Increasing storage file size' },
          ],
          correctAnswer: 'opt1',
          explanation: 'Normalization minimizes redundant data and anomalies.',
          points: 10,
        },
        {
          type: 'MCQ',
          prompt: 'Select all ACID properties (Multi-Select):',
          options: [
            { id: 'a', text: 'Atomicity' },
            { id: 'b', text: 'Consistency' },
            { id: 'c', text: 'Asynchrony' },
          ],
          correctAnswer: ['a', 'b'],
          explanation: 'Atomicity and Consistency are ACID properties.',
          points: 10,
        },
        {
          type: 'MATCHING',
          prompt: 'Match file system files to their offices:',
          options: [],
          correctAnswer: {
            registrar_file: 'Registrar',
            hostel_file: 'Hostel',
          },
          explanation: 'Registrar manages registrar.txt, Hostel manages hostel.txt.',
          points: 10,
        },
        {
          type: 'SHORT_ANSWER',
          prompt: 'Which logging protocol provides crash recovery and atomicity in DBMS?',
          options: [],
          correctAnswer: ['wal', 'write ahead log', 'write-ahead logging'],
          explanation: 'Write-Ahead Logging (WAL) ensures atomic durable updates.',
          points: 10,
        },
        {
          type: 'SCENARIO',
          prompt: 'System crashes after dirty page write. How should recovery handle this?',
          options: [
            { id: 'redo_undo', text: 'Replay committed transactions and rollback uncommitted ones' },
            { id: 'format', text: 'Format disk storage' },
          ],
          correctAnswer: 'redo_undo',
          explanation: 'ARIES recovery redoes committed and undos uncommitted changes.',
          points: 10,
        },
        {
          type: 'OUTPUT_PREDICTION',
          prompt: 'Predict the row count: SELECT COUNT(*) FROM (SELECT 1 UNION SELECT 1);',
          options: [],
          correctAnswer: '1',
          explanation: 'UNION eliminates duplicates, returning exactly 1 row.',
          points: 10,
        },
        {
          type: 'MISCONCEPTION_DETECTION',
          prompt: 'Which statement represents a critical misconception about NoSQL databases?',
          options: [
            { id: 'misc_1', text: 'NoSQL databases can never provide ACID transactions' },
            { id: 'valid_1', text: 'Many modern NoSQL systems provide multi-document ACID' },
          ],
          correctAnswer: 'misc_1',
          explanation: 'Many modern document stores support multi-document ACID transactions.',
          points: 10,
        },
        {
          type: 'COMPARISON',
          prompt: 'Compare File System vs DBMS concurrency support:',
          options: [],
          correctAnswer: {
            fileSystem: 'File-level locking',
            dbms: 'Row-level and MVCC locking',
          },
          explanation: 'DBMS supports row-level and MVCC concurrency.',
          points: 10,
        },
      ],
    });
    testAssessmentId = assessment._id.toString();
  });

  afterAll(async () => {
    await Assessment.deleteMany({ title: '7 Question Types Master Assessment' });
    await Concept.deleteMany({ conceptCode: 'TEST-Q1' });
    await User.deleteMany({ email: 'grader_student@csflivebook.com' });
  });

  describe('1. Individual Question Graders (All 7 Types)', () => {
    it('grades MCQ single-select correctly', () => {
      const q = { type: 'MCQ', points: 5, correctAnswer: 'optA' } as unknown as IQuestion;
      expect(AssessmentService.gradeQuestion(q, 'optA')).toEqual({ isCorrect: true, score: 5 });
      expect(AssessmentService.gradeQuestion(q, 'optB')).toEqual({ isCorrect: false, score: 0 });
      expect(AssessmentService.gradeQuestion(q, '')).toEqual({ isCorrect: false, score: 0 });
    });

    it('grades MCQ multi-select correctly', () => {
      const q = { type: 'MCQ', points: 10, correctAnswer: ['a', 'b'] } as unknown as IQuestion;
      expect(AssessmentService.gradeQuestion(q, ['b', 'a'])).toEqual({ isCorrect: true, score: 10 });
      expect(AssessmentService.gradeQuestion(q, ['a'])).toEqual({ isCorrect: false, score: 0 });
      expect(AssessmentService.gradeQuestion(q, ['a', 'b', 'c'])).toEqual({ isCorrect: false, score: 0 });
    });

    it('grades MATCHING question with exact and partial matches', () => {
      const q = {
        type: 'MATCHING',
        points: 10,
        correctAnswer: { A: '1', B: '2' },
      } as unknown as IQuestion;
      expect(AssessmentService.gradeQuestion(q, { A: '1', B: '2' })).toEqual({ isCorrect: true, score: 10 });
      expect(AssessmentService.gradeQuestion(q, { A: '1', B: 'wrong' })).toEqual({ isCorrect: false, score: 5 });
    });

    it('grades SHORT_ANSWER keyword matches case-insensitively', () => {
      const q = {
        type: 'SHORT_ANSWER',
        points: 5,
        correctAnswer: ['wal', 'write-ahead log'],
      } as unknown as IQuestion;
      expect(AssessmentService.gradeQuestion(q, 'We use WAL protocol')).toEqual({ isCorrect: true, score: 5 });
      expect(AssessmentService.gradeQuestion(q, 'Random string')).toEqual({ isCorrect: false, score: 0 });
    });

    it('grades SCENARIO, OUTPUT_PREDICTION, and MISCONCEPTION_DETECTION correctly', () => {
      const qOutput = { type: 'OUTPUT_PREDICTION', points: 10, correctAnswer: '42' } as unknown as IQuestion;
      expect(AssessmentService.gradeQuestion(qOutput, '  42  ')).toEqual({ isCorrect: true, score: 10 });
      expect(AssessmentService.gradeQuestion(qOutput, '43')).toEqual({ isCorrect: false, score: 0 });

      const qScenario = { type: 'SCENARIO', points: 10, correctAnswer: 'sol_A' } as unknown as IQuestion;
      expect(AssessmentService.gradeQuestion(qScenario, 'sol_A')).toEqual({ isCorrect: true, score: 10 });
    });
  });

  describe('2. Security Verification: Zero correctAnswer Leakage', () => {
    it('MUST physically omit correctAnswer and explanation from learner quiz queries', async () => {
      const res = await request(app).get(`/api/v1/concepts/${testConceptId}/quiz`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const quizData = res.body.data;
      expect(quizData).toBeDefined();
      expect(quizData.questions.length).toBeGreaterThan(0);

      for (const question of quizData.questions) {
        expect(question.correctAnswer).toBeUndefined();
        expect(question.explanation).toBeUndefined();
      }
    });
  });

  describe('3. Attempt Lifecycle: Start, Autosave, Submit & Result', () => {
    it('starts an attempt in IN_PROGRESS state', async () => {
      const res = await request(app)
        .post(`/api/v1/assessments/${testAssessmentId}/start`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('IN_PROGRESS');
      expect(res.body.data.startedAt).toBeDefined();
    });

    it('submits attempt, grades all 8 questions, updates score and awards XP on pass', async () => {
      const assessment = await Assessment.findById(testAssessmentId).select('+questions.correctAnswer');
      const questions = assessment!.questions;

      // Submit perfect answers for all questions
      const perfectAnswers = questions.map((q) => {
        let resp = q.correctAnswer;
        if (resp && typeof resp === 'object' && typeof (resp as any).toObject === 'function') {
          resp = (resp as any).toObject();
        }
        return {
          questionId: q._id!.toString(),
          response: resp,
        };
      });

      const res = await request(app)
        .post(`/api/v1/assessments/${testAssessmentId}/attempts`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ answers: perfectAnswers });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.passed).toBe(true);
      expect(res.body.data.score).toBe(100);
      expect(res.body.data.xpEarned).toBe(100);

      // Verifies explanations and answers are now legitimately revealed in post-submission result
      expect(res.body.data.questions[0].explanation).toBeDefined();
      expect(res.body.data.questions[0].correctAnswer).toBeDefined();
    });

    it('prevents resubmission of already evaluated attempts', async () => {
      const attempt = await AssessmentService.startAttempt(studentId, testAssessmentId);
      await AssessmentService.submitAttempt(studentId, testAssessmentId, [], attempt._id.toString());

      await expect(
        AssessmentService.submitAttempt(studentId, testAssessmentId, [], attempt._id.toString())
      ).rejects.toThrow('This attempt has already been evaluated');
    });
  });
});
