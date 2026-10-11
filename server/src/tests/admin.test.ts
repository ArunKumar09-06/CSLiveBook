import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { connectDB } from '../config/database';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Subject } from '../models/Subject';
import { Module } from '../models/Module';
import { Concept } from '../models/Concept';
import { signAccessToken } from '../lib/jwt';
import argon2 from 'argon2';

const app = createApp();

describe('Phase 8: Admin Console & Authorization Suite', () => {
  let adminToken: string;
  let studentToken: string;
  let testSubjectId: string;
  let testModuleId: string;

  beforeAll(async () => {
    await connectDB();

    // Create Admin User
    let admin = await User.findOne({ email: 'admin_test@csflivebook.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin_test@csflivebook.com',
        passwordHash: await argon2.hash('AdminPass123!'),
        role: 'ADMIN',
      });
    }
    adminToken = signAccessToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: 'ADMIN',
    });

    // Create Student User
    let student = await User.findOne({ email: 'student_test@csflivebook.com' });
    if (!student) {
      student = await User.create({
        name: 'Regular Student',
        email: 'student_test@csflivebook.com',
        passwordHash: await argon2.hash('StudentPass123!'),
        role: 'STUDENT',
      });
    }
    studentToken = signAccessToken({
      userId: student._id.toString(),
      email: student.email,
      role: 'STUDENT',
    });

    // Seed Subject and Module for admin tests
    const subj = await Subject.create({
      name: 'Admin Test Subject',
      slug: 'admin-test-subject',
      description: 'Subject for admin automated tests',
      icon: 'database',
      themeKey: 'dbms',
      order: 99,
      isPublished: true,
    });
    testSubjectId = subj._id.toString();

    const mod = await Module.create({
      subjectId: subj._id,
      name: 'Admin Test Module',
      slug: 'admin-test-module',
      description: 'Module for admin automated tests',
      order: 1,
      isPublished: true,
    });
    testModuleId = mod._id.toString();
  });

  afterAll(async () => {
    await Subject.deleteMany({ slug: 'admin-test-subject' });
    await Module.deleteMany({ slug: 'admin-test-module' });
    await Concept.deleteMany({ slug: { $regex: /^admin-new-concept/ } });
    await User.deleteMany({ email: { $in: ['admin_test@csflivebook.com', 'student_test@csflivebook.com'] } });
  });

  describe('1. Role-Gated Authorization Guards', () => {
    it('blocks unauthenticated requests to admin routes (401)', async () => {
      const res = await request(app).get('/api/v1/admin/analytics');
      expect(res.status).toBe(401);
    });

    it('blocks STUDENT role from accessing admin endpoints (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('allows ADMIN role to access analytics (200 OK)', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.metrics).toBeDefined();
    });
  });

  describe('2. Concept Authoring Without Touching Code', () => {
    let createdConceptId: string;

    it('creates a new concept via POST /admin/concepts', async () => {
      const res = await request(app)
        .post('/api/v1/admin/concepts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          moduleId: testModuleId,
          conceptCode: 'C99',
          title: 'Distributed Consensus & Raft Protocol',
          slug: 'admin-new-concept-raft',
          description: 'Understanding leader election, log replication, and split-brain safety.',
          estimatedMinutes: 20,
          difficulty: 'ADVANCED',
          tags: ['distributed-systems', 'consensus', 'raft'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Distributed Consensus & Raft Protocol');
      createdConceptId = res.body.data._id;
    });

    it('updates content blocks via PUT /admin/concepts/:id/content', async () => {
      const newBlocks = [
        {
          type: 'heading',
          id: 'leader-election',
          level: 2,
          text: '1. Leader Election Mechanics',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Raft Invariant',
          text: 'At most one leader can be elected in a given term.',
        },
        {
          type: 'code',
          language: 'go',
          code: 'func (rf *Raft) RequestVote(args *RequestVoteArgs, reply *RequestVoteReply) {\n  // Leader Election\n}',
        },
      ];

      const res = await request(app)
        .put(`/api/v1/admin/concepts/${createdConceptId}/content`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ blocks: newBlocks });

      expect(res.status).toBe(200);
      expect(res.body.data.blocks.length).toBe(3);
      expect(res.body.data.version).toBeGreaterThan(1);
    });

    it('imports raw markdown to blocks via POST /admin/concepts/:id/content/import-markdown', async () => {
      const rawMarkdown = `# Raft Overview\n\nRaft is designed to be easily understandable.\n\n## Terms and Heartbeats\n\nLeaders send periodic heartbeats to followers.`;

      const res = await request(app)
        .post(`/api/v1/admin/concepts/${createdConceptId}/content/import-markdown`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ markdown: rawMarkdown });

      expect(res.status).toBe(200);
      expect(res.body.data.blocks.length).toBeGreaterThan(1);
    });

    it('attaches video and cheat sheet resources', async () => {
      // Set Video
      const videoRes = await request(app)
        .post(`/api/v1/admin/resources/video/${createdConceptId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          url: 'https://example.com/raft-masterclass.mp4',
          chapters: [{ title: 'Intro', timeSec: 0 }],
        });
      expect(videoRes.status).toBe(200);
      expect(videoRes.body.data.type).toBe('VIDEO');

      // Set Cheat Sheet
      const csRes = await request(app)
        .post(`/api/v1/admin/resources/cheatsheet/${createdConceptId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          blocks: {
            conceptCode: 'C99',
            title: 'Raft Protocol Cheat Sheet',
            sections: [],
          },
        });
      expect(csRes.status).toBe(200);
      expect(csRes.body.data.type).toBe('CHEAT_SHEET');
    });

    it('toggles concept publish status', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/concepts/${createdConceptId}/publish`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isPublished: false });

      expect(res.status).toBe(200);
      expect(res.body.data.isPublished).toBe(false);
    });
  });
});
