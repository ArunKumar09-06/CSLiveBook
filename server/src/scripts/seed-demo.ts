import argon2 from 'argon2';
import { connectDB, disconnectDB } from '../config/database.js';
import {
  User,
  Concept,
  ConceptContent,
  Assessment,
  ConceptResource,
} from '../models/index.js';
import { seedCurriculum } from './seed-curriculum.js';
import { ContentBlock, TableOfContentsItem } from '@csf/shared';

export const seedDemo = async () => {
  console.log('🌱 Starting full demo seeding...');
  await connectDB();

  // 1. Seed curriculum tree
  await seedCurriculum();

  // 2. Seed demo users
  console.log('👤 Seeding demo users...');
  const adminPasswordHash = await argon2.hash('AdminPass123!');
  const studentPasswordHash = await argon2.hash('StudentPass123!');

  await User.findOneAndUpdate(
    { email: 'admin@csflivebook.com' },
    {
      name: 'CSF Livebook Admin',
      email: 'admin@csflivebook.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      xp: 2500,
      badges: ['Curriculum Master', 'System Architect'],
    },
    { upsert: true, new: true }
  );

  await User.findOneAndUpdate(
    { email: 'student@csflivebook.com' },
    {
      name: 'Alex Chen',
      email: 'student@csflivebook.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      streak: { current: 5, longest: 14, lastActiveDate: new Date().toISOString().split('T')[0] },
      xp: 450,
      badges: ['First Concept', 'Night Owl'],
    },
    { upsert: true, new: true }
  );
  console.log('✅ Demo users created (admin@csflivebook.com & student@csflivebook.com)');

  // 3. Find Concept C1
  const c1 = await Concept.findOne({ conceptCode: 'C1' });
  if (!c1) {
    throw new Error('Concept C1 was not found after curriculum seeding!');
  }

  // 4. Populate Concept C1 Content Blocks
  console.log('📚 Populating Concept C1 content blocks...');
  const c1Blocks: ContentBlock[] = [
    {
      id: 'b-h1',
      type: 'heading',
      level: 1,
      text: 'DBMS vs File System, DBMS vs RDBMS',
    },
    {
      id: 'b-callout-1',
      type: 'callout',
      variant: 'info',
      title: 'Interview Importance (P0 Must-Know)',
      content:
        'This is the opening question in nearly 40% of database interview loops. Interviewers look for deep understanding of data independence, ACID trade-offs, and why flat files fail under concurrent transactions.',
    },
    {
      id: 'b-text-1',
      type: 'text',
      content:
        'Before database management systems existed, applications stored records in sequential or random-access flat files on disk (like CSVs, binary structs, or text logs). While simple, this architecture created massive structural pain as organizations scaled.',
    },
    {
      id: 'b-h2-1',
      type: 'heading',
      level: 2,
      text: 'Visualizing the Conflict: Three Offices, Three Private Files',
    },
    {
      id: 'b-diag-vb1',
      type: 'diagram',
      visualKey: 'VB-1',
      title: 'VB-1: Three Offices, Three Private Files vs Centralized DBMS',
      caption: 'Left: Isolated silo files leading to duplication. Right: Unified DBMS query processor & catalog.',
      whatToNotice: [
        'Notice how each department historically duplicated student contact records.',
        'A single change in hostel address leaves registrar and library with stale records.',
        'Under DBMS, all three client applications interact through a shared query engine and data catalog.',
      ],
      steps: [
        {
          stepNumber: 1,
          label: 'File System Silos',
          description: 'Registrar, Hostel, and Library maintain separate file systems on disk.',
        },
        {
          stepNumber: 2,
          label: 'Data Divergence',
          description: 'Student updates phone number at Hostel office; Registrar retains obsolete data.',
        },
        {
          stepNumber: 3,
          label: 'DBMS Consolidation',
          description: 'Single logical database instance handles concurrent multi-tenant queries through ACID locks.',
        },
      ],
      has3D: true,
    },
    {
      id: 'b-h2-2',
      type: 'heading',
      level: 2,
      text: 'Architectural Comparison: File System vs DBMS',
    },
    {
      id: 'b-comp-1',
      type: 'comparison',
      title: 'File System vs DBMS Architecture',
      leftTitle: 'Traditional File System',
      rightTitle: 'Database Management System (DBMS)',
      criteria: [
        {
          name: 'Data Redundancy',
          left: 'High: duplicated across departmental flat files',
          right: 'Minimal: controlled normalization with single source of truth',
        },
        {
          name: 'Data Consistency',
          left: 'Prone to inconsistency and stale reads',
          right: 'Enforced automatically via constraints and ACID isolation',
        },
        {
          name: 'Data Independence',
          left: 'None: application code hardcodes file byte layouts',
          right: 'Full physical & logical data independence via 3-tier ANSI-SPARC',
        },
        {
          name: 'Concurrent Access',
          left: 'File-level locking or unsafe clobbering',
          right: 'Granular row/page lock protocols & MVCC multi-versioning',
        },
        {
          name: 'Crash Recovery',
          left: 'Manual backups; interrupted writes corrupt file headers',
          right: 'Automatic Write-Ahead Logging (WAL) and ARIES recovery',
        },
      ],
    },
    {
      id: 'b-h2-3',
      type: 'heading',
      level: 2,
      text: 'Data Inconsistency in Action',
    },
    {
      id: 'b-diag-vb2',
      type: 'diagram',
      visualKey: 'VB-2',
      title: 'VB-2: The 3-Step Inconsistency Story',
      caption: 'Demonstrating how uncontrolled updates without 2-phase locks yield contradictory financial reports.',
      whatToNotice: [
        'Step 1: Sam updates student record in the Hostel department file.',
        'Step 2: Registrar file and Library file remain untouched.',
        'Step 3: End-of-month aggregate report pulls from conflicting sources, resulting in reconciliation failure.',
      ],
      steps: [
        {
          stepNumber: 1,
          label: 'Local File Update',
          description: 'Hostel clerk edits student record locally.',
        },
        {
          stepNumber: 2,
          label: 'Isolated State',
          description: 'No cross-file notification mechanism exists.',
        },
        {
          stepNumber: 3,
          label: 'Conflicting Report',
          description: 'Analytics queries return mutually incompatible balances.',
        },
      ],
      has3D: true,
    },
    {
      id: 'b-misc-1',
      type: 'misconception',
      myth: 'DBMS always replaces File Systems completely.',
      reality: 'A DBMS itself runs on top of the OS file system or raw disk blocks.',
      explanation:
        'DBMS relies on OS disk primitives (like fsync and block allocation) or raw device drivers, but adds its own buffer pool manager, lock manager, and write-ahead log to guarantee ACID properties.',
    },
    {
      id: 'b-h2-4',
      type: 'heading',
      level: 2,
      text: 'DBMS vs RDBMS: The Relational Evolution',
    },
    {
      id: 'b-text-2',
      type: 'text',
      content:
        'A generic DBMS may store data hierarchically (like XML/tree structures) or as simple key-value pairs. An **RDBMS** specifically enforces E.F. Codd’s relational model: data is organized into mathematical relations (tables) with typed domains (columns), where relationships are maintained through values (foreign keys) rather than physical disk pointers.',
    },
    {
      id: 'b-code-1',
      type: 'code',
      language: 'sql',
      title: 'Declarative Referential Integrity in RDBMS',
      code: `-- Enforcing referential integrity and cascading rules at the schema level
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept_id INT NOT NULL,
    salary NUMERIC(10, 2) CHECK (salary > 0),
    CONSTRAINT fk_dept
        FOREIGN KEY (dept_id)
        REFERENCES departments(dept_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);`,
      copyable: true,
    },
    {
      id: 'b-iq-1',
      type: 'interview_question',
      question:
        'If a company has 10 million simple key-value log entries per day, would you choose an RDBMS or a File/NoSQL store? Justify your choice.',
      frequency: 'VERY_HIGH',
      modelAnswer:
        'For high-volume append-only write workloads like access logs without relational joins or complex transactions, an append-only file store or distributed NoSQL store (like Cassandra or S3 + Parquet) is superior. An RDBMS imposes unnecessary B-tree rebalancing, WAL write overhead, and table lock contention that degrades ingest throughput.',
      followUps: [
        {
          question: 'What if we later need ad-hoc aggregation queries over these logs?',
          answer:
            'Use an OLAP columnar engine (like ClickHouse, Snowflake, or DuckDB) or ingest from the log pipeline into an analytical warehouse rather than an OLTP transactional RDBMS.',
        },
        {
          question: 'How does Write-Ahead Logging (WAL) protect against power failure?',
          answer:
            'Before any dirty database page in memory is flushed to data files on disk, the corresponding log record describing the delta is written sequentially to the WAL and flushed with fsync. On reboot, the recovery engine replays or rolls back incomplete transactions.',
        },
      ],
    },
    {
      id: 'b-recap-1',
      type: 'recap',
      title: 'If you remember only 5 things from this lesson',
      keyPoints: [
        'File systems lack data independence: changing disk format forces rewriting application code.',
        'Concurrent file updates cause lost updates, dirty reads, and file corruption without transactional lock managers.',
        'DBMS provides physical & logical data independence through the 3-Tier ANSI-SPARC architecture.',
        'RDBMS organizes data into relations (tables) and guarantees entity and referential integrity.',
        'ACID properties (Atomicity, Consistency, Isolation, Durability) are the foundation of relational guarantees.',
      ],
    },
  ];

  const c1TOC: TableOfContentsItem[] = [
    { id: 'b-h1', text: 'DBMS vs File System, DBMS vs RDBMS', level: 1 },
    { id: 'b-h2-1', text: 'Visualizing the Conflict: Three Offices, Three Private Files', level: 2 },
    { id: 'b-h2-2', text: 'Architectural Comparison: File System vs DBMS', level: 2 },
    { id: 'b-h2-3', text: 'Data Inconsistency in Action', level: 2 },
    { id: 'b-h2-4', text: 'DBMS vs RDBMS: The Relational Evolution', level: 2 },
  ];

  await ConceptContent.findOneAndUpdate(
    { conceptId: c1._id },
    {
      conceptId: c1._id,
      blocks: c1Blocks,
      version: 1,
      tableOfContents: c1TOC,
    },
    { upsert: true, new: true }
  );

  // 5. Populate Concept C1 Assessment (Quiz)
  console.log('📝 Populating Concept C1 Quiz with 5 questions...');
  await Assessment.findOneAndUpdate(
    { conceptId: c1._id, type: 'CONCEPT_QUIZ' },
    {
      conceptId: c1._id,
      type: 'CONCEPT_QUIZ',
      title: 'Concept C1 Assessment: DBMS Fundamentals',
      description: 'Test your understanding of file systems, data independence, and relational guarantees.',
      timeLimit: 600, // 10 minutes
      passingScore: 70,
      isPublished: true,
      questions: [
        {
          type: 'MCQ',
          prompt: 'What is the primary definition of Logical Data Independence?',
          options: [
            { id: 'opt-a', text: 'Ability to modify physical storage without altering conceptual schema' },
            { id: 'opt-b', text: 'Ability to modify conceptual schema without altering external views/apps' },
            { id: 'opt-c', text: 'Ability to store records on different physical hard drives' },
            { id: 'opt-d', text: 'Ability to query tables without writing SQL syntax' },
          ],
          correctAnswer: 'opt-b',
          explanation:
            'Logical data independence allows the conceptual schema to expand or alter (e.g., adding attributes or splitting tables) without breaking existing external user views or application programs.',
          points: 1,
          order: 0,
          tags: ['architecture', 'ansi-sparc'],
          learningObjective: 'Understand data independence tiers',
        },
        {
          type: 'MCQ',
          prompt: 'Which of the following are inherent problems of traditional flat-file data storage? (Select all that apply)',
          options: [
            { id: 'opt-1', text: 'Data redundancy and inconsistency across files' },
            { id: 'opt-2', text: 'Difficulty in accessing data due to tightly coupled access code' },
            { id: 'opt-3', text: 'Concurrent execution anomalies and lost updates' },
            { id: 'opt-4', text: 'Automatic query plan optimization' },
          ],
          correctAnswer: ['opt-1', 'opt-2', 'opt-3'],
          explanation:
            'Flat file systems suffer from redundancy, tight coupling, and concurrency race conditions. Query plan optimization is a feature of DBMS engines, not a flaw of file systems.',
          points: 2,
          order: 1,
          tags: ['file-system', 'anomalies'],
          learningObjective: 'Identify limitations of file systems',
        },
        {
          type: 'MATCHING',
          prompt: 'Match each Database concept with its core operational guarantee:',
          options: [
            { id: 'p1', text: 'Atomicity' },
            { id: 'p2', text: 'Durability' },
            { id: 'p3', text: 'Isolation' },
            { id: 't1', text: 'All-or-nothing transaction completion' },
            { id: 't2', text: 'Committed transactions survive power loss' },
            { id: 't3', text: 'Concurrent transactions do not interfere' },
          ],
          correctAnswer: {
            p1: 't1',
            p2: 't2',
            p3: 't3',
          },
          explanation:
            'Atomicity guarantees all-or-nothing execution, Durability ensures persistence via WAL upon commit, and Isolation shields concurrent executions.',
          points: 2,
          order: 2,
          tags: ['acid', 'transactions'],
          learningObjective: 'Differentiate ACID principles',
        },
        {
          type: 'MISCONCEPTION_DETECTION',
          prompt: 'True or False: A DBMS directly interacts with disk hardware without relying on the operating system kernel.',
          options: [
            { id: 'opt-true', text: 'True' },
            { id: 'opt-false', text: 'False' },
          ],
          correctAnswer: 'opt-false',
          explanation:
            'False. While some specialized appliances use raw disk partitions, standard DBMS software issues system calls to the operating system kernel for I/O scheduling, file descriptors, and memory allocation.',
          points: 1,
          order: 3,
          tags: ['misconceptions', 'os-dbms'],
          learningObjective: 'Understand OS and DBMS interaction',
        },
        {
          type: 'SCENARIO',
          prompt:
            'A hospital changes its patient emergency contact field format from a 10-digit number to an international format with country codes. The hospital billing portal continues operating without any code changes. What architectural property is demonstrated?',
          options: [
            { id: 'opt-phys', text: 'Physical Data Independence' },
            { id: 'opt-log', text: 'Logical Data Independence' },
            { id: 'opt-poly', text: 'Compile-time Polymorphism' },
            { id: 'opt-acid', text: 'Strict Serializability' },
          ],
          correctAnswer: 'opt-log',
          explanation:
            'This demonstrates Logical Data Independence: the conceptual schema changed, but the external view provided to the billing portal remained unchanged or mapped through a backward-compatible view.',
          points: 2,
          order: 4,
          tags: ['data-independence', 'scenario'],
          learningObjective: 'Apply data independence to real-world engineering',
        },
      ],
    },
    { upsert: true, new: true }
  );

  // 6. Populate Concept C1 Cheat Sheet Resource
  console.log('📑 Populating Concept C1 Cheat Sheet...');
  const c1CheatSheetJSON = {
    conceptId: c1._id.toString(),
    conceptTitle: 'DBMS vs File System, DBMS vs RDBMS Cheat Sheet',
    quickSummary:
      'A concise single-page guide summarizing why DBMS replaced flat files, the 3-Tier ANSI-SPARC model, and the relational model rules.',
    sections: [
      {
        id: 'sec-1',
        title: 'Core Architecture Comparison',
        color: '#22D3EE',
        items: [
          {
            label: 'Data Redundancy',
            description: 'File System: High and unmanaged. DBMS: Minimized via normalization.',
          },
          {
            label: 'Concurrency Control',
            description: 'File System: Entire-file locking. DBMS: Fine-grained row/page locks & MVCC.',
          },
          {
            label: 'Integrity Enforcement',
            description: 'File System: Application-level code. DBMS: Database schema constraints.',
          },
        ],
      },
      {
        id: 'sec-2',
        title: 'ANSI-SPARC 3-Tier Architecture',
        color: '#8B5CF6',
        items: [
          {
            label: 'Physical Level',
            description: 'How data is stored on disk (B-trees, pages, blocks, compression).',
          },
          {
            label: 'Conceptual Level',
            description: 'What data is stored and entity relationships (tables, keys, schemas).',
          },
          {
            label: 'External Level',
            description: 'Individual user and application views tailored to specific needs.',
          },
        ],
      },
      {
        id: 'sec-3',
        title: 'RDBMS vs General DBMS',
        color: '#34D399',
        items: [
          {
            label: 'Relational Model',
            description: 'RDBMS organizes data into relations (tables) with strict mathematical tuples.',
          },
          {
            label: 'Codd 12 Rules',
            description: 'Foundational criteria defining what makes a database truly relational.',
          },
          {
            label: 'Keys',
            description: 'Primary, Candidate, Foreign, Alternate keys enforce integrity.',
          },
        ],
      },
    ],
    keyFormulasOrRules: [
      'Physical Data Independence = Physical level change does NOT affect Conceptual level.',
      'Logical Data Independence = Conceptual level change does NOT affect External views.',
      'Candidate Key = Minimal Super Key (no redundant attributes).',
    ],
    commonPitfalls: [
      'Confusing Physical Data Independence with Logical Data Independence.',
      'Thinking a Primary Key can contain NULL values (Entity Integrity strictly prohibits NULL).',
      'Believing foreign keys can point to non-unique columns.',
    ],
    interviewOneLiners: [
      'A file system stores raw bytes; a DBMS understands the semantic meaning and constraints of data.',
      'RDBMS relates data through values; hierarchical databases relate data through physical pointers.',
    ],
  };

  await ConceptResource.findOneAndUpdate(
    { conceptId: c1._id, type: 'CHEAT_SHEET' },
    {
      conceptId: c1._id,
      type: 'CHEAT_SHEET',
      source: 'JSON_BLOCKS',
      content: JSON.stringify(c1CheatSheetJSON, null, 2),
      isPublished: true,
    },
    { upsert: true, new: true }
  );

  // 7. Populate Concept C1 Video Resource
  console.log('🎥 Populating Concept C1 Video Resource...');
  await ConceptResource.findOneAndUpdate(
    { conceptId: c1._id, type: 'VIDEO' },
    {
      conceptId: c1._id,
      type: 'VIDEO',
      source: 'URL',
      content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      metadata: {
        duration: 380, // 6m 20s
        size: 15480000,
        format: 'mp4',
        originalName: 'C1_DBMS_vs_FileSystem_Revision.mp4',
        chapters: [
          { timestamp: 0, title: 'Introduction & Flat File System Limitations' },
          { timestamp: 75, title: 'VB-1: The Three Offices Analogy' },
          { timestamp: 160, title: 'ANSI-SPARC 3-Tier Architecture' },
          { timestamp: 240, title: 'Physical vs Logical Data Independence' },
          { timestamp: 310, title: 'Top 3 Interview Questions & Recap' },
        ],
      },
      isPublished: true,
    },
    { upsert: true, new: true }
  );

  console.log('🎉 Full Demo Seed completed successfully!');
};

// If run directly
if (process.argv[1]?.includes('seed-demo')) {
  seedDemo()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Failed to seed demo:', err);
      process.exit(1);
    });
}
