import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { seedDemo } from '../scripts/seed-demo.js';
import { Concept } from '../models/Concept.js';
import { User } from '../models/User.js';
import { signAccessToken } from '../lib/jwt.js';

describe('Curriculum, Content & Learner API Suite', () => {
  const app = createApp();

  let studentToken: string;
  let studentUser: any;
  let c1Concept: any;

  beforeAll(async () => {
    // Seed full curriculum, demo users, and C1 data
    await seedDemo();

    studentUser = await User.findOne({ email: 'student@csflivebook.com' }).lean();
    studentToken = signAccessToken({
      userId: studentUser._id.toString(),
      email: studentUser.email,
      role: studentUser.role,
    });

    c1Concept = await Concept.findOne({ conceptCode: 'C1' }).lean();
    expect(c1Concept).toBeDefined();
  });

  describe('Curriculum Discovery Endpoints', () => {
    it('GET /api/v1/curriculum should return the complete 8-subject aggregated tree', async () => {
      const res = await request(app).get('/api/v1/curriculum');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(8);

      const dbmsSubject = res.body.data.find((s: any) => s.slug === 'dbms-sql');
      expect(dbmsSubject).toBeDefined();
      expect(dbmsSubject.modules.length).toBe(8);

      const firstModule = dbmsSubject.modules[0];
      expect(firstModule.concepts.length).toBe(5);
      expect(firstModule.concepts[0].conceptCode).toBe('C1');
    });

    it('GET /api/v1/subjects should return 8 subjects with module & concept counts', async () => {
      const res = await request(app).get('/api/v1/subjects');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(8);

      const dbms = res.body.data.find((s: any) => s.slug === 'dbms-sql');
      expect(dbms).toBeDefined();
      expect(dbms.moduleCount).toBe(8);
      expect(dbms.conceptCount).toBe(38);
    });

    it('GET /api/v1/subjects/:slug should return subject details with nested modules and concepts', async () => {
      const res = await request(app).get('/api/v1/subjects/dbms-sql');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('DBMS & SQL');
      expect(res.body.data.modules.length).toBe(8);
      expect(res.body.data.modules[0].concepts.length).toBe(5);
    });
  });

  describe('Concept C1 Delivery Verification (Milestone Requirement)', () => {
    it('GET /api/v1/concepts/slug/:slug should return C1 metadata with breadcrumb context', async () => {
      const res = await request(app).get(`/api/v1/concepts/slug/${c1Concept.slug}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.conceptCode).toBe('C1');
      expect(res.body.data.module.name).toBe('Database Fundamentals');
      expect(res.body.data.subject.name).toBe('DBMS & SQL');
      expect(res.body.data.subject.themeKey).toBe('dbms');
    });

    it('GET /api/v1/concepts/:conceptId/content should return C1 rich content blocks', async () => {
      const res = await request(app).get(`/api/v1/concepts/${c1Concept._id}/content`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.blocks.length).toBeGreaterThan(5);

      const blocks = res.body.data.blocks;
      const diagramBlocks = blocks.filter((b: any) => b.type === 'diagram');
      expect(diagramBlocks.length).toBe(2);
      expect(diagramBlocks[0].visualKey).toBe('VB-1');
      expect(diagramBlocks[1].visualKey).toBe('VB-2');

      const comparisonBlock = blocks.find((b: any) => b.type === 'comparison');
      expect(comparisonBlock).toBeDefined();
      expect(comparisonBlock.leftTitle).toBe('Traditional File System');

      const recapBlock = blocks.find((b: any) => b.type === 'recap');
      expect(recapBlock).toBeDefined();
      expect(recapBlock.keyPoints.length).toBe(5);
    });

    it('GET /api/v1/concepts/:conceptId/resources should return both video and cheat sheet resources', async () => {
      const res = await request(app).get(`/api/v1/concepts/${c1Concept._id}/resources`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);

      const videoRes = res.body.data.find((r: any) => r.type === 'VIDEO');
      expect(videoRes).toBeDefined();
      expect(videoRes.metadata.chapters.length).toBe(5);

      const cheatSheetRes = res.body.data.find((r: any) => r.type === 'CHEAT_SHEET');
      expect(cheatSheetRes).toBeDefined();
    });

    it('GET /api/v1/concepts/:conceptId/cheatsheet should return structured cheat sheet blocks', async () => {
      const res = await request(app).get(`/api/v1/concepts/${c1Concept._id}/cheatsheet`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe('CHEAT_SHEET');
      expect(res.body.data.content.sections.length).toBe(3);
      expect(res.body.data.content.keyFormulasOrRules.length).toBe(3);
    });

    it('GET /api/v1/concepts/:conceptId/quiz should return assessment questions WITHOUT correctAnswer leak', async () => {
      const res = await request(app).get(`/api/v1/concepts/${c1Concept._id}/quiz`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.questions.length).toBe(5);

      // CRITICAL LEAK TEST: Neither correctAnswer nor explanation can be present
      for (const q of res.body.data.questions) {
        expect(q.correctAnswer).toBeUndefined();
        expect(q.explanation).toBeUndefined();
        expect(q.prompt).toBeDefined();
        expect(q.options.length).toBeGreaterThan(0);
      }
    });

    it('GET /api/v1/concepts/:conceptId/related should return next concept in sequence', async () => {
      const res = await request(app).get(`/api/v1/concepts/${c1Concept._id}/related`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.previous).toBeNull();
      expect(res.body.data.next).toBeDefined();
      expect(res.body.data.next.conceptCode).toBe('C2');
    });
  });

  describe('Learner Progress & Tracking Endpoints', () => {
    it('POST /api/v1/concepts/:conceptId/start should transition concept to IN_PROGRESS', async () => {
      const res = await request(app)
        .post(`/api/v1/concepts/${c1Concept._id}/start`)
        .set('Cookie', [`accessToken=${studentToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('PATCH /api/v1/concepts/:conceptId/position should save resume block and video time', async () => {
      const res = await request(app)
        .patch(`/api/v1/concepts/${c1Concept._id}/position`)
        .set('Cookie', [`accessToken=${studentToken}`])
        .send({
          lastBlockId: 'b-diag-vb1',
          videoPositionSec: 135,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.lastBlockId).toBe('b-diag-vb1');
      expect(res.body.data.videoPositionSec).toBe(135);
    });

    it('POST /api/v1/concepts/:conceptId/complete should mark concept COMPLETED and award XP', async () => {
      const userBefore = await User.findById(studentUser._id).lean();

      const res = await request(app)
        .post(`/api/v1/concepts/${c1Concept._id}/complete`)
        .set('Cookie', [`accessToken=${studentToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('COMPLETED');

      const userAfter = await User.findById(studentUser._id).lean();
      expect(userAfter!.xp).toBe(userBefore!.xp + 50);
    });

    it('GET /api/v1/users/me/dashboard should return resume card, overall progress, and subject cards', async () => {
      const res = await request(app)
        .get('/api/v1/users/me/dashboard')
        .set('Cookie', [`accessToken=${studentToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.overallProgress.total).toBe(184);
      expect(res.body.data.overallProgress.completed).toBe(1);
      expect(res.body.data.resumeConcept).toBeDefined();
      expect(res.body.data.resumeConcept.conceptCode).toBe('C1');
      expect(res.body.data.resumeConcept.lastBlockId).toBe('b-diag-vb1');
      expect(res.body.data.subjectProgress.length).toBe(8);
    });

    it('GET /api/v1/users/me/progress should return overall percentage calculation', async () => {
      const res = await request(app)
        .get('/api/v1/users/me/progress')
        .set('Cookie', [`accessToken=${studentToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.completed).toBe(1);
      expect(res.body.data.totalConcepts).toBe(184);
    });
  });

  describe('Bookmarks & Notes Endpoints', () => {
    it('POST & GET /api/v1/users/me/bookmarks should add and retrieve bookmarked concept', async () => {
      const addRes = await request(app)
        .post('/api/v1/users/me/bookmarks')
        .set('Cookie', [`accessToken=${studentToken}`])
        .send({ conceptId: c1Concept._id.toString() });

      expect(addRes.status).toBe(201);

      const listRes = await request(app)
        .get('/api/v1/users/me/bookmarks')
        .set('Cookie', [`accessToken=${studentToken}`]);

      expect(listRes.status).toBe(200);
      expect(listRes.body.data.length).toBeGreaterThan(0);
      expect(listRes.body.data[0].concept.conceptCode).toBe('C1');
    });

    it('DELETE /api/v1/users/me/bookmarks/:conceptId should remove bookmark', async () => {
      const delRes = await request(app)
        .delete(`/api/v1/users/me/bookmarks/${c1Concept._id}`)
        .set('Cookie', [`accessToken=${studentToken}`]);

      expect(delRes.status).toBe(200);

      const listRes = await request(app)
        .get('/api/v1/users/me/bookmarks')
        .set('Cookie', [`accessToken=${studentToken}`]);

      expect(listRes.body.data.length).toBe(0);
    });

    it('POST, GET, PATCH, DELETE /api/v1/users/me/notes should manage student notes', async () => {
      // 1. Create Note
      const createRes = await request(app)
        .post('/api/v1/users/me/notes')
        .set('Cookie', [`accessToken=${studentToken}`])
        .send({
          conceptId: c1Concept._id.toString(),
          blockId: 'b-h2-1',
          text: 'Remember ANSI-SPARC 3-tier architecture for the Goldman Sachs interview!',
        });

      expect(createRes.status).toBe(201);
      const noteId = createRes.body.data._id;
      expect(noteId).toBeDefined();

      // 2. Read Note
      const listRes = await request(app)
        .get(`/api/v1/users/me/notes?conceptId=${c1Concept._id}`)
        .set('Cookie', [`accessToken=${studentToken}`]);

      expect(listRes.status).toBe(200);
      expect(listRes.body.data.length).toBe(1);

      // 3. Update Note
      const updateRes = await request(app)
        .patch(`/api/v1/users/me/notes/${noteId}`)
        .set('Cookie', [`accessToken=${studentToken}`])
        .send({ text: 'Updated: Remember physical vs logical data independence!' });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.text).toContain('physical vs logical');

      // 4. Delete Note
      const delRes = await request(app)
        .delete(`/api/v1/users/me/notes/${noteId}`)
        .set('Cookie', [`accessToken=${studentToken}`]);

      expect(delRes.status).toBe(200);
    });
  });

  describe('Global Search Endpoints', () => {
    it('GET /api/v1/search?q=dbms should return matching subjects, modules, and concepts', async () => {
      const res = await request(app).get('/api/v1/search?q=dbms');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subjects.length).toBeGreaterThan(0);
      expect(res.body.data.concepts.length).toBeGreaterThan(0);
      expect(res.body.data.concepts[0].conceptCode).toBe('C1');
    });

    it('GET /api/v1/search?q=C1 should find concept C1 specifically', async () => {
      const res = await request(app).get('/api/v1/search?q=C1');
      expect(res.status).toBe(200);
      expect(res.body.data.concepts.some((c: any) => c.conceptCode === 'C1')).toBe(true);
    });
  });
});
