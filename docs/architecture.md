# CSF Livebook — Architectural Specification

## Overview
**CSF Livebook** (Computer Science Fundamentals Livebook) is an interview-preparation learning platform for computer science students covering the **CS Fundamentals Interview Master Curriculum**: **8 subjects, 42 modules, 184 high-priority concepts**.

Built on a production-grade **MERN** stack (MongoDB, Express, React, Node.js) with strict TypeScript across all layers.

---

## 1. Monorepo Organization
The repository is structured as an npm workspaces monorepo:
```
csf-livebook/
├── shared/           # @csf/shared: Enums, Zod schemas, TypeScript types, API contracts
├── server/           # @csf/server: Express REST API, Mongoose models, auth, assessment engine
├── client/           # @csf/client: React 19 / Vite frontend, 3D scenes, design system
├── docs/             # Technical specifications & curriculum blueprints
├── docker-compose.yml# Production & local orchestrations (MongoDB, Server, Client)
└── package.json      # Workspace root
```

---

## 2. Curriculum Hierarchy Matrix
- **Subject**: Top-level discipline (DBMS & SQL, OOP, OS, Computer Networks, DevOps, Computer Architecture, System Design, GenAI).
  - **Module**: Thematic learning unit (e.g. Database Fundamentals, Relational Algebra, SQL Mastery, Normalization).
    - **Concept**: Atomic high-yield interview lesson (e.g. C1 "DBMS vs File System, DBMS vs RDBMS").

### Scope by Subject:
1. **DBMS & SQL**: 8 modules, 38 concepts
2. **Object-Oriented Programming**: 5 modules, 24 concepts
3. **Operating Systems**: 8 modules, 40 concepts
4. **Computer Networks**: 6 modules, 25 concepts
5. **DevOps and Software Delivery**: 5 modules, 23 concepts
6. **Computer Architecture**: 1 module, 2 concepts
7. **System Design Fundamentals**: 3 modules, 9 concepts
8. **GenAI and AI Fundamentals**: 6 modules, 23 concepts
**Total**: 8 subjects, 42 modules, 184 concepts.

---

## 3. Data Storage & Security Invariants
- **Database Engine**: MongoDB 7.0 via Mongoose 8.x.
- **Answer Key Protection**: In the `assessments` collection, `questions.correctAnswer` is configured with `select: false`. Default queries issued by learner endpoints never transmit `correctAnswer` or explanation keys to the browser before submission.
- **Password Security**: Passwords are saved as Argon2 hashes; `passwordHash` is configured with `select: false` on the User model.
- **Session Tokens**: Short-lived JWT access tokens (15m) + rotated refresh tokens (30d) stored hashed in MongoDB (`refreshtokens` collection with TTL index). Tokens delivered exclusively via `httpOnly`, `Secure`, `SameSite` cookies.

---

## 4. Assessment Engine
Supported Question Types:
- `MCQ`: Single-select and multi-select options.
- `MATCHING`: Pair key-value mapping.
- `SHORT_ANSWER`: Keyword-based automated scoring with review queue fallback.
- `SCENARIO`: Problem-solving and situational judgment questions.
- `OUTPUT_PREDICTION`: Code trace output evaluation.
- `MISCONCEPTION_DETECTION`: Myth vs reality discrimination.
- `COMPARISON`: Tradeoff and architectural matrix evaluation.

---

## 5. Visual Design System
- **Theme**: "Aurora on deep space"
  - Base backgrounds: `#05060F`, `#0B0D1E`, `#12152B`
  - Glass panels: `rgba(255,255,255,0.06)` with backdrop blur and subtle border
  - Brand Aurora: `#7C3AED` -> `#4F46E5` -> `#06B6D4` -> `#34D399`
  - Typography: Sora (Display), Inter (Body), JetBrains Mono (Code)
  - 3D Visualizations: React Three Fiber interactive diagrams (VB-1 to VB-6) with 2D accessible SVG fallbacks.
