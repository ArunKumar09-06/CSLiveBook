# CSF Livebook — REST API Specification (`/api/v1`)

All API responses follow the standard JSON response envelope:
```json
{
  "success": true,
  "data": { ... },
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": [ ... ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 184
  }
}
```

---

## 1. Authentication & Session Management

All auth tokens (`accessToken` and `refreshToken`) are delivered strictly in `httpOnly`, `SameSite: 'lax'`, `Secure` cookies. Never stored in browser `localStorage`.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Create a new student account (`email`, `password`, `name`) | Public |
| `POST` | `/auth/login` | Authenticate with credentials & receive cookies | Public |
| `POST` | `/auth/refresh` | Rotate refresh token & issue new access token | Cookie |
| `POST` | `/auth/logout` | Revoke active refresh token & clear cookies | Authenticated |
| `GET` | `/auth/me` | Fetch active user profile, streak, & XP | Authenticated |
| `PATCH` | `/auth/me` | Update name, avatar, or theme/motion preferences | Authenticated |
| `POST` | `/auth/change-password` | Update account password | Authenticated |
| `POST` | `/auth/forgot-password` | Request password reset token via email | Public |
| `POST` | `/auth/reset-password` | Reset password using reset token | Public |

---

## 2. Curriculum & Content

Public reads for published content; authenticated users receive progress overlays.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/curriculum` | Return entire 8-subject tree with modules & concepts | Public |
| `GET` | `/subjects` | List all published subjects with metrics | Public |
| `GET` | `/subjects/:slug` | Get single subject with modules and roadmaps | Public |
| `GET` | `/subjects/:subjectId/modules` | List modules for a specific subject | Public |
| `GET` | `/modules/:moduleId` | Fetch single module details | Public |
| `GET` | `/modules/:moduleId/concepts` | List all concepts in a module | Public |
| `GET` | `/concepts/slug/:slug` | Fetch concept by unique URL slug | Public |
| `GET` | `/concepts/:conceptId/content` | Fetch typed content blocks & TOC | Public |
| `GET` | `/concepts/:conceptId/resources` | Fetch revision video and cheat sheet | Public |
| `GET` | `/concepts/:conceptId/related` | Fetch prerequisite & follow-up concepts | Public |
| `POST` | `/concepts/:conceptId/start` | Record concept start & update lastAccessedAt | Authenticated |
| `POST` | `/concepts/:conceptId/complete` | Mark concept completed & increment streak | Authenticated |
| `PATCH` | `/concepts/:conceptId/position` | Debounced update of reading block & video position | Authenticated |

---

## 3. Assessments & Grading

**Security Invariant:** Correct answers and full explanations are NEVER selected or leaked prior to submission.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/concepts/:conceptId/quiz` | Get quiz questions (WITHOUT `correctAnswer` or explanation) | Public/Auth |
| `POST` | `/assessments/:id/attempts` | Submit answers, grade on server, award XP & streak | Authenticated |
| `GET` | `/assessments/attempts/:attemptId` | Get graded attempt result with explanations & deep links | Authenticated |
| `GET` | `/assessments/:id/attempts/me` | List learner's prior attempts and highest score | Authenticated |

---

## 4. Learner Extras & Search

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/users/me/dashboard` | Dashboard metrics: resume concept, progress, streak | Authenticated |
| `GET` | `/users/me/activity` | 14-day activity heatmap, concept count, quiz history | Authenticated |
| `GET` | `/users/me/bookmarks` | List all bookmarked concepts | Authenticated |
| `POST` | `/users/me/bookmarks` | Bookmark a concept | Authenticated |
| `DELETE` | `/users/me/bookmarks/:conceptId`| Remove bookmark | Authenticated |
| `GET` | `/users/me/notes` | List student notes | Authenticated |
| `POST` | `/users/me/notes` | Create a note attached to a concept or block | Authenticated |
| `GET` | `/search?q=` | Full-text search across subjects, modules, and concepts | Public |

---

## 5. Admin Console & Authoring (`ADMIN` role only)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/analytics` | Platform metrics: DAU, total learners, pass rates, hardest questions |
| `POST` | `/admin/concepts` | Create a new curriculum concept |
| `PATCH` | `/admin/concepts/:id/publish` | Toggle concept published status |
| `PUT` | `/admin/concepts/:id/content` | Upsert content blocks and bump version |
| `POST` | `/admin/concepts/:id/content/import-markdown` | Parse raw markdown into structured content blocks |
| `POST` | `/admin/resources/video/:conceptId` | Configure concept revision video URL & chapters |
| `POST` | `/admin/resources/cheatsheet/blocks`| Upsert structured cheat sheet JSON blocks |
| `PUT` | `/admin/assessments/:id` | Create or update quiz questions with answer keys |

---

## 6. System Probes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Liveness probe (returns uptime, memory, timestamp) |
| `GET` | `/ready` | Readiness probe (verifies active MongoDB connection) |
