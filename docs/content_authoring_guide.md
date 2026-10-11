# CSF Livebook — Content Authoring & Curriculum Guide

## 1. Overview
CSF Livebook structures learning content into a strictly typed, composable **Content Block System**. This allows educators to combine markdown text with interactive code sandboxes, side-by-side comparison tables, interactive diagrams, and instant understanding checks.

---

## 2. Content Block Types & Schemas

Every block is a typed JSON object residing within the `blocks` array of `ConceptContent`:

### 2.1 Core Typography Blocks
- **`heading`**:
  ```json
  { "id": "b1", "type": "heading", "level": 2, "text": "Core Architectural Tradeoffs" }
  ```
- **`text`**: Supports GitHub Flavored Markdown (bold, italic, inline code, lists).
  ```json
  { "id": "b2", "type": "text", "content": "A file system delegates integrity checking to the client application..." }
  ```

### 2.2 Pedagogical Callouts & Alerts
- **`callout`**:
  - Variants: `info`, `tip`, `warning`, `danger`, `note`
  ```json
  {
    "id": "b3",
    "type": "callout",
    "variant": "warning",
    "title": "Concurrency Hazard",
    "content": "Without two-phase locking, concurrent updates may overwrite each other."
  }
  ```

### 2.3 Interactive Code Blocks
- **`code`**:
  - Highlights syntax using Shiki with copy action and line highlight support.
  ```json
  {
    "id": "b4",
    "type": "code",
    "language": "sql",
    "code": "SELECT student_id, COUNT(*) FROM enrollments GROUP BY student_id HAVING COUNT(*) > 3;",
    "filename": "query.sql"
  }
  ```

### 2.4 Comparison & Misconception Cards
- **`comparison`**:
  - Side-by-side versus cards for tradeoff evaluation.
  ```json
  {
    "id": "b5",
    "type": "comparison",
    "title": "File System vs DBMS",
    "leftTitle": "Traditional File System",
    "leftItems": ["Data isolation", "Redundant storage", "No atomic transactions"],
    "rightTitle": "Relational DBMS",
    "rightItems": ["Integrated catalog", "ACID guarantees", "Declarative SQL queries"]
  }
  ```
- **`misconception`**:
  - Click-to-flip card contrasting common interview myths with technical reality.
  ```json
  {
    "id": "b6",
    "type": "misconception",
    "myth": "A DBMS is always faster than a flat file system for simple sequential reads.",
    "reality": "Flat files have less overhead for simple streams, but DBMS excels at concurrency, indexing, and recovery."
  }
  ```

### 2.5 Active Recall & Understanding Checks
- **`understanding_check`**:
  - Inline mini-question with instant feedback embedded directly in the text.
  ```json
  {
    "id": "b7",
    "type": "understanding_check",
    "question": "Which component manages data dictionary metadata?",
    "options": ["Query Parser", "System Catalog", "Buffer Pool", "Log Writer"],
    "correctIndex": 1,
    "explanation": "The System Catalog (or Data Dictionary) holds all schema metadata."
  }
  ```
- **`interview_question`**:
  - Interview questions with model answer reveal and follow-up chains.
  ```json
  {
    "id": "b8",
    "type": "interview_question",
    "question": "How would you explain ACID to a junior developer?",
    "modelAnswer": "Atomicity ensures all-or-nothing...",
    "followUps": [
      { "question": "What happens if a crash occurs mid-transaction?", "answer": "The Write-Ahead Log (WAL) undoes incomplete transactions upon recovery." }
    ]
  }
  ```

---

## 3. Interactive Diagrams (`diagram`)
Visual diagrams map a `visualKey` to an interactive React component via `DiagramRenderer`:
```json
{
  "id": "b9",
  "type": "diagram",
  "visualKey": "VB1",
  "title": "Three Offices, Three Private Files",
  "caption": "Comparison of isolated files vs centralized DBMS architecture",
  "whatToNotice": [
    "Isolated files lead to divergent data schemas.",
    "A central DBMS provides unified catalog management."
  ]
}
```

Registered Diagram Keys:
- `VB1`: "Three offices, three private files" (isolated vs DBMS catalog, with 2D/3D toggle).
- `VB2`: "Inconsistency Story" (3-step animated scrubber illustrating update anomalies).
- `VB3`–`VB6`: Relational schema views, concurrency locks, and query lifecycle.

---

## 4. Assessment Authoring & Seven Question Types
Quizzes are authored either in the Admin Console or via seed files with 7 question types:
1. `MCQ`: Multiple choice (single and multi-select).
2. `MATCHING`: Pair key-value dictionary matching.
3. `SHORT_ANSWER`: Keyword-based rubric evaluation.
4. `SCENARIO`: Situation-based design diagnosis.
5. `OUTPUT_PREDICTION`: Predict the outcome of a code snippet or SQL query.
6. `MISCONCEPTION_DETECTION`: Identify false technical statements.
7. `COMPARISON`: Evaluate architectural tradeoffs.

*Note:* `correctAnswer` is strictly `select: false` on learner endpoints and only used during server-side submission evaluation.
