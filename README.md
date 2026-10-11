# CSF Livebook — CS Fundamentals Interview Master Platform

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-Strict_5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=for-the-badge&logo=three.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Tests](https://img.shields.io/badge/Vitest-55%2F55_Passed-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

**An interview-preparation platform for computer science students covering 8 subjects, 42 modules, and 184 high-priority concepts.**

*Built on the MERN stack with end-to-end TypeScript, "Aurora on Deep Space" aesthetics, interactive 3D visualizations, and secure server-side assessment grading.*

[Quickstart](#quickstart-in-under-5-minutes) • [Curriculum](#curriculum-matrix) • [Architecture](#architecture--security-invariants) • [Design System](#design-system-aurora-on-deep-space) • [Deployment](#deployment-guide)

</div>

---

## 🚀 Key Highlights

1. **Curriculum Scope**:
   - Covers the complete **CS Fundamentals Interview Master Curriculum**: **8 subjects, 42 modules, 184 high-priority concepts** (P0 must-know & P1 very-likely).
   - Atomic mini-lessons equipped with **Learn (Content Blocks)**, **Video (Custom Player)**, **Cheat Sheet (Interactive JSON & PDF)**, **Quiz (Server Graded)**, and **Interview Intelligence (Model Answers & Follow-up chains)**.

2. **First-Look Wow ("Aurora on Deep Space")**:
   - Dark cinematic canvas (`#05060F`) accented by luminous multi-colour gradient aurora lights and glassmorphic depth (`backdrop-filter: blur(20px) saturate(140%)`).
   - Interactive 3D **Knowledge Galaxy** hero scene built with React Three Fiber, orbiting 8 colored subject orbs with pointer parallax and non-WebGL fallback.
   - Interactive 2D/3D Diagrams (**VB-1 to VB-6**) featuring step-through anomaly scrubbing and 3D architecture switching.

3. **Production-Grade Engineering**:
   - **Monorepo Architecture**: npm workspaces (`shared`, `server`, `client`) with shared Zod validation schemas and TypeScript types.
   - **Zero Answer-Key Leaks**: Graded assessments store `correctAnswer` strictly with `select: false`. Correct answers are never sent to learner browsers before evaluation.
   - **Modern Auth**: Argon2id password hashing, short-lived JWT access tokens + rotated refresh tokens in `httpOnly`, `SameSite: 'lax'`, `Secure` cookies with SHA-256 token hashing and replay attack detection.

---

## 📚 Curriculum Matrix

| Subject | Modules | Concepts | Gradient Accent |
|---|---|---|---|
| **1. DBMS & SQL** | 8 | 38 | Cyan &rarr; Blue (`#22D3EE → #3B82F6`) |
| **2. Object-Oriented Programming** | 5 | 24 | Violet &rarr; Fuchsia (`#8B5CF6 → #D946EF`) |
| **3. Operating Systems** | 8 | 40 | Orange &rarr; Rose (`#FB923C → #F43F5E`) |
| **4. Computer Networks** | 6 | 25 | Emerald &rarr; Teal (`#34D399 → #14B8A6`) |
| **5. DevOps and Software Delivery** | 5 | 23 | Amber &rarr; Orange (`#FBBF24 → #F97316`) |
| **6. Computer Architecture** | 1 | 2 | Sky &rarr; Slate (`#38BDF8 → #64748B`) |
| **7. System Design Fundamentals** | 3 | 9 | Indigo &rarr; Purple (`#6366F1 → #A855F7`) |
| **8. GenAI and AI Fundamentals** | 6 | 23 | Pink &rarr; Violet (`#F472B6 → #8B5CF6`) |
| **Total** | **42** | **184** | Full Aurora Spectrum |

---

## ⚡ Quickstart in Under 5 Minutes

### Option A: Docker Compose (Recommended)
Launch the entire system (MongoDB 7.0, Express Server, and Nginx Client):
```bash
docker compose up --build
```
- Client Frontend: [http://localhost:5173](http://localhost:5173)
- Server API: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- API Health Probe: [http://localhost:4000/health](http://localhost:4000/health)

### Option B: Local Development
Prerequisites: Node.js 20+ LTS, MongoDB running locally on port 27017.

```bash
# 1. Install all dependencies across workspaces
npm install

# 2. Build the shared types package
npm run build --workspace=@csf/shared

# 3. Seed curriculum and demo content (184 concepts + C1 lesson)
npm --prefix server run seed:demo

# 4. Start backend and frontend development servers concurrently
npm run dev
```

---

## 🛡️ Demo Credentials

The seeded database comes with pre-configured accounts for instant evaluation:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@csflivebook.com` | `AdminPass123!` |
| **Student** | `student@csflivebook.com` | `StudentPass123!` |

*(The login screen also features 1-click credential auto-fill buttons for demo convenience).*

---

## 🧪 Testing & Quality Gates

Run the automated test suite across all services:
```bash
# Run server Vitest suite (Auth, Curriculum, Assessments, Graders, Admin, Security leak tests)
npm --prefix server test

# Validate client TypeScript and production bundle
npm --prefix client run build
```
**Current Test Coverage**: 55 / 55 tests passing across 6 test suites with 0 compilation errors.

---

## 🌐 Deployment Guide

### 1. Database (MongoDB Atlas)
1. Create a free cluster on MongoDB Atlas.
2. In Network Access, whitelist the outgoing IP addresses of your server hosting provider (or `0.0.0.0/0` with secure credentials).
3. Copy the connection string and set `MONGODB_URI` in server environment variables.

### 2. Backend API (Render / Railway / Fly.io)
1. Connect this GitHub repository.
2. Root directory: `.` (or configure monorepo build).
3. Build Command: `npm install && npm run build --workspace=@csf/shared && npm run build --workspace=@csf/server`
4. Start Command: `node server/dist/server.js`
5. Environment Variables:
   ```
   NODE_ENV=production
   SERVER_PORT=4000
   CLIENT_URL=https://your-frontend-domain.com
   MONGODB_URI=mongodb+srv://...
   JWT_ACCESS_SECRET=your_32_character_secret_here
   JWT_REFRESH_SECRET=your_32_character_secret_here
   COOKIE_DOMAIN=.your-domain.com
   ```

### 3. Frontend Client (Vercel / Netlify / Cloudflare Pages)
1. Connect repository.
2. Root directory: `client`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-api.com/api/v1
   ```

---

## 📖 Documentation Index

- [Architecture & Invariants](docs/architecture.md)
- [REST API Specification](docs/api.md)
- [Design System & Aurora Tokens](docs/design_system.md)
- [Content Authoring & Block Schemas](docs/content_authoring_guide.md)

---

## 📜 License
MIT License &copy; CSF Livebook Team.
