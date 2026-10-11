export interface SeedConcept {
  conceptCode: string;
  title: string;
  slug: string;
  description: string;
  estimatedMinutes: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  tags: string[];
}

export interface SeedModule {
  name: string;
  slug: string;
  description: string;
  concepts: SeedConcept[];
}

export interface SeedSubject {
  name: string;
  slug: string;
  description: string;
  icon: string;
  themeKey: string;
  modules: SeedModule[];
}

export const CURRICULUM_DATA: SeedSubject[] = [
  // 1. DBMS & SQL (38 concepts, 8 modules)
  {
    name: 'DBMS & SQL',
    slug: 'dbms-sql',
    description:
      'Master relational database fundamentals, relational algebra, SQL queries, normalization, transactions, ACID, indexing, and storage engines.',
    icon: 'Database',
    themeKey: 'dbms',
    modules: [
      {
        name: 'Database Fundamentals',
        slug: 'dbms-fundamentals',
        description: 'Core architectures, data models, file systems vs DBMS, and ER modeling.',
        concepts: [
          {
            conceptCode: 'C1',
            title: 'DBMS vs File System, DBMS vs RDBMS',
            slug: 'dbms-vs-file-system-dbms-vs-rdbms',
            description: 'Why database management systems superseded flat files, and how relational models enforce relational integrity.',
            estimatedMinutes: 20,
            difficulty: 'BEGINNER',
            tags: ['dbms', 'fundamentals', 'rdbms', 'storage'],
          },
          {
            conceptCode: 'C2',
            title: '3-Tier ANSI-SPARC Architecture & Data Independence',
            slug: '3-tier-ansi-sparc-architecture-data-independence',
            description: 'Physical, conceptual, and external schema separation and why logical data independence matters.',
            estimatedMinutes: 15,
            difficulty: 'BEGINNER',
            tags: ['architecture', 'ansi-sparc', 'schemas'],
          },
          {
            conceptCode: 'C3',
            title: 'Relational Model, Keys (Candidate, Primary, Super, Foreign, Alternate)',
            slug: 'relational-model-keys',
            description: 'Understanding relation schema, domain constraints, super keys, candidate keys, and foreign keys.',
            estimatedMinutes: 20,
            difficulty: 'BEGINNER',
            tags: ['keys', 'relational-model', 'primary-key'],
          },
          {
            conceptCode: 'C4',
            title: 'Integrity Constraints & Referential Integrity Rules',
            slug: 'integrity-constraints-referential-integrity',
            description: 'Entity integrity, referential integrity, and cascading actions on update/delete.',
            estimatedMinutes: 15,
            difficulty: 'BEGINNER',
            tags: ['constraints', 'integrity', 'foreign-keys'],
          },
          {
            conceptCode: 'C5',
            title: 'ER Modeling, Cardinality, Weak Entities & Extended ER',
            slug: 'er-modeling-cardinality-weak-entities',
            description: 'Entity-relationship diagrams, mapping cardinalities, identifying relationships, and generalization/specialization.',
            estimatedMinutes: 25,
            difficulty: 'INTERMEDIATE',
            tags: ['er-diagram', 'cardinality', 'modeling'],
          },
        ],
      },
      {
        name: 'Relational Algebra & Calculus',
        slug: 'relational-algebra-calculus',
        description: 'Formal relational query languages, procedural algebra, and declarative calculus.',
        concepts: [
          {
            conceptCode: 'C6',
            title: 'Relational Algebra Operations (Select, Project, Join, Set Operations)',
            slug: 'relational-algebra-operations',
            description: 'Fundamental algebraic operators: sigma (select), pi (project), Cartesian product, union, and set difference.',
            estimatedMinutes: 20,
            difficulty: 'INTERMEDIATE',
            tags: ['relational-algebra', 'operators', 'math'],
          },
          {
            conceptCode: 'C7',
            title: 'Equi-Join, Natural Join, Outer Joins (Left, Right, Full)',
            slug: 'joins-relational-algebra',
            description: 'Theta joins, equi-joins, natural joins, semi-joins, and outer joins mechanics.',
            estimatedMinutes: 20,
            difficulty: 'INTERMEDIATE',
            tags: ['joins', 'relational-algebra'],
          },
          {
            conceptCode: 'C8',
            title: 'Tuple Relational Calculus & Domain Relational Calculus',
            slug: 'tuple-domain-relational-calculus',
            description: 'Declarative queries using TRC and DRC formulas, safe expressions, and quantifiers.',
            estimatedMinutes: 25,
            difficulty: 'ADVANCED',
            tags: ['trc', 'drc', 'calculus'],
          },
          {
            conceptCode: 'C9',
            title: 'Relational Completeness & Query Equivalence',
            slug: 'relational-completeness-query-equivalence',
            description: 'Codd theorem, relational completeness, and heuristic algebraic query optimization.',
            estimatedMinutes: 20,
            difficulty: 'ADVANCED',
            tags: ['query-equivalence', 'optimization'],
          },
        ],
      },
      {
        name: 'SQL Mastery',
        slug: 'sql-mastery',
        description: 'From fundamental queries to advanced analytics, window functions, and execution plans.',
        concepts: [
          {
            conceptCode: 'C10',
            title: 'DDL, DML, DCL, TCL Commands & Execution Model',
            slug: 'sql-command-types-execution-model',
            description: 'Difference between schema definition, manipulation, control, and transaction statements.',
            estimatedMinutes: 15,
            difficulty: 'BEGINNER',
            tags: ['sql', 'ddl', 'dml', 'tcl'],
          },
          {
            conceptCode: 'C11',
            title: 'Aggregate Functions, GROUP BY, HAVING Deep Dive',
            slug: 'aggregate-functions-group-by-having',
            description: 'Execution order of SQL queries, aggregation behavior on NULLs, and filtering grouped data.',
            estimatedMinutes: 20,
            difficulty: 'BEGINNER',
            tags: ['sql', 'group-by', 'having', 'aggregates'],
          },
          {
            conceptCode: 'C12',
            title: 'Subqueries (Correlated vs Non-Correlated) & EXISTS vs IN',
            slug: 'subqueries-correlated-exists-vs-in',
            description: 'Subquery unnesting, correlated evaluation costs, and performance differences between EXISTS and IN.',
            estimatedMinutes: 25,
            difficulty: 'INTERMEDIATE',
            tags: ['sql', 'subqueries', 'performance'],
          },
          {
            conceptCode: 'C13',
            title: 'Window Functions (ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD)',
            slug: 'sql-window-functions',
            description: 'Analytic SQL: OVER (PARTITION BY ... ORDER BY), sliding frames, and interview ranking patterns.',
            estimatedMinutes: 30,
            difficulty: 'INTERMEDIATE',
            tags: ['sql', 'window-functions', 'rank'],
          },
          {
            conceptCode: 'C14',
            title: 'Common Table Expressions (CTEs) & Recursive CTEs',
            slug: 'ctes-recursive-ctes',
            description: 'Readable queries with CTEs and traversing hierarchical graphs and trees with recursive SQL.',
            estimatedMinutes: 25,
            difficulty: 'INTERMEDIATE',
            tags: ['sql', 'cte', 'recursion'],
          },
          {
            conceptCode: 'C15',
            title: 'Views, Materialized Views, and Updatability',
            slug: 'views-materialized-views',
            description: 'Virtual views, refresh strategies for materialized views, and security isolation.',
            estimatedMinutes: 15,
            difficulty: 'INTERMEDIATE',
            tags: ['views', 'performance'],
          },
          {
            conceptCode: 'C16',
            title: 'SQL Query Optimization & EXPLAIN Query Plan Analysis',
            slug: 'sql-query-optimization-explain-plan',
            description: 'Interpreting sequential scans vs index scans, nested loops vs hash joins in EXPLAIN output.',
            estimatedMinutes: 30,
            difficulty: 'ADVANCED',
            tags: ['optimization', 'explain', 'indexes'],
          },
        ],
      },
      {
        name: 'Normalization & Schema Design',
        slug: 'normalization-schema-design',
        description: 'Eliminating redundancy, anomalies, functional dependencies, and decomposition.',
        concepts: [
          {
            conceptCode: 'C17',
            title: "Functional Dependencies, Armstrong's Axioms, Closure & Minimal Cover",
            slug: 'functional-dependencies-closure-minimal-cover',
            description: 'Axioms of sound and complete inference, attribute closure computation, and canonical covers.',
            estimatedMinutes: 25,
            difficulty: 'INTERMEDIATE',
            tags: ['normalization', 'functional-dependency'],
          },
          {
            conceptCode: 'C18',
            title: 'First, Second, and Third Normal Forms (1NF, 2NF, 3NF)',
            slug: '1nf-2nf-3nf-normalization',
            description: 'Atomic attributes, partial dependency elimination, and transitive dependency removal.',
            estimatedMinutes: 25,
            difficulty: 'INTERMEDIATE',
            tags: ['1nf', '2nf', '3nf', 'normalization'],
          },
          {
            conceptCode: 'C19',
            title: 'Boyce-Codd Normal Form (BCNF) vs 3NF Tradeoffs',
            slug: 'bcnf-vs-3nf-tradeoffs',
            description: 'Strict superkey determinism, dependency preservation tradeoffs, and decomposition algorithms.',
            estimatedMinutes: 25,
            difficulty: 'ADVANCED',
            tags: ['bcnf', '3nf', 'tradeoffs'],
          },
          {
            conceptCode: 'C20',
            title: 'Multivalued Dependencies & Fourth Normal Form (4NF)',
            slug: 'multivalued-dependencies-4nf',
            description: 'Independent 1-to-many relationships in one relation and 4NF decomposition rules.',
            estimatedMinutes: 20,
            difficulty: 'ADVANCED',
            tags: ['4nf', 'multivalued-dependency'],
          },
          {
            conceptCode: 'C21',
            title: 'Lossless Join Decomposition & Dependency Preservation Test',
            slug: 'lossless-join-decomposition-dependency-preservation',
            description: 'Testing decomposition correctness via common attribute intersection and Chase algorithm.',
            estimatedMinutes: 25,
            difficulty: 'ADVANCED',
            tags: ['lossless-join', 'decomposition'],
          },
        ],
      },
      {
        name: 'Transaction Management & Concurrency Control',
        slug: 'transactions-concurrency-control',
        description: 'ACID guarantees, schedules, isolation levels, locking, and deadlock mitigation.',
        concepts: [
          {
            conceptCode: 'C22',
            title: 'ACID Properties & Transaction State Machine',
            slug: 'acid-properties-transaction-states',
            description: 'Atomicity, Consistency, Isolation, Durability, and transaction lifecycle transitions.',
            estimatedMinutes: 20,
            difficulty: 'BEGINNER',
            tags: ['acid', 'transactions'],
          },
          {
            conceptCode: 'C23',
            title: 'Concurrency Problems (Dirty Read, Non-repeatable Read, Phantom Read)',
            slug: 'concurrency-anomalies-dirty-phantom-read',
            description: 'Anomalies occurring in unconstrained concurrent interleavings.',
            estimatedMinutes: 20,
            difficulty: 'INTERMEDIATE',
            tags: ['concurrency', 'anomalies'],
          },
          {
            conceptCode: 'C24',
            title: 'SQL Isolation Levels (Read Uncommitted to Serializable) & MVCC',
            slug: 'sql-isolation-levels-mvcc',
            description: 'ANSI isolation levels, snapshot isolation, and multi-version concurrency control.',
            estimatedMinutes: 25,
            difficulty: 'INTERMEDIATE',
            tags: ['isolation-levels', 'mvcc'],
          },
          {
            conceptCode: 'C25',
            title: 'Serializability (Conflict vs View) & Precedence Graph Test',
            slug: 'conflict-serializability-precedence-graph',
            description: 'Conflict equivalence, topological sorting on serialization graphs, and view serializability.',
            estimatedMinutes: 25,
            difficulty: 'ADVANCED',
            tags: ['serializability', 'precedence-graph'],
          },
          {
            conceptCode: 'C26',
            title: 'Lock-Based Protocols (2PL, Strict 2PL, Rigorous 2PL) & Lock Conversions',
            slug: 'two-phase-locking-strict-2pl',
            description: 'Growing and shrinking phases, cascading abort prevention, and exclusive vs shared locks.',
            estimatedMinutes: 25,
            difficulty: 'ADVANCED',
            tags: ['2pl', 'locking', 'concurrency'],
          },
          {
            conceptCode: 'C27',
            title: 'Deadlock Handling (Prevention, Detection, Wait-Die, Wound-Wait)',
            slug: 'deadlock-handling-wait-die-wound-wait',
            description: 'Wait-for graphs, timestamp-based non-preemptive and preemptive deadlock prevention protocols.',
            estimatedMinutes: 25,
            difficulty: 'ADVANCED',
            tags: ['deadlock', 'concurrency'],
          },
        ],
      },
      {
        name: 'Storage, Indexing & Hashing',
        slug: 'storage-indexing-hashing',
        description: 'Physical storage models, B-trees, clustered indexing, and hash structures.',
        concepts: [
          {
            conceptCode: 'C28',
            title: 'File Organization & Record Layout (Heap, Sorted, Clustered)',
            slug: 'file-organization-record-layout',
            description: 'Fixed vs variable length records, slotted page architecture, and heap files.',
            estimatedMinutes: 20,
            difficulty: 'INTERMEDIATE',
            tags: ['storage', 'pages', 'heap'],
          },
          {
            conceptCode: 'C29',
            title: 'B-Trees and B+ Trees Architecture & Cost Analysis',
            slug: 'b-trees-b-plus-trees-architecture',
            description: 'Node fan-out, node split and merge, disk I/O reduction, and range scan advantages of B+ Trees.',
            estimatedMinutes: 30,
            difficulty: 'ADVANCED',
            tags: ['b-tree', 'b-plus-tree', 'indexing'],
          },
          {
            conceptCode: 'C30',
            title: 'Clustered vs Non-Clustered Indexes & Composite Index Rules',
            slug: 'clustered-vs-non-clustered-indexes',
            description: 'Primary clustered ordering, secondary pointer lookups, and leftmost prefix index rules.',
            estimatedMinutes: 25,
            difficulty: 'INTERMEDIATE',
            tags: ['indexing', 'clustered', 'composite-index'],
          },
          {
            conceptCode: 'C31',
            title: 'Static & Dynamic Hashing (Extendible vs Linear Hashing)',
            slug: 'static-dynamic-hashing-extendible-linear',
            description: 'Hash directory doubling in extendible hashing vs gradual bucket splitting in linear hashing.',
            estimatedMinutes: 25,
            difficulty: 'ADVANCED',
            tags: ['hashing', 'storage'],
          },
          {
            conceptCode: 'C32',
            title: 'Query Processing Pipeline, Parsing, Relational Query Trees & Cost Estimator',
            slug: 'query-processing-pipeline-cost-estimator',
            description: 'Parser, semantic analyzer, logical plan generation, catalog statistics, and cost-based optimization.',
            estimatedMinutes: 25,
            difficulty: 'ADVANCED',
            tags: ['query-engine', 'optimizer'],
          },
        ],
      },
      {
        name: 'Crash Recovery & Logging',
        slug: 'crash-recovery-logging',
        description: 'Durability under failures, write-ahead logging, and recovery algorithms.',
        concepts: [
          {
            conceptCode: 'C33',
            title: 'Log-Based Recovery (WAL Principle, Undo/Redo Logging)',
            slug: 'log-based-recovery-wal-undo-redo',
            description: 'The Write-Ahead Logging contract, log sequence numbers (LSN), and force vs no-steal policies.',
            estimatedMinutes: 25,
            difficulty: 'ADVANCED',
            tags: ['recovery', 'wal', 'logging'],
          },
          {
            conceptCode: 'C34',
            title: 'Checkpointing Mechanisms (Checkpointing vs Fuzzy Checkpointing)',
            slug: 'checkpointing-fuzzy-checkpointing',
            description: 'Minimizing recovery work by flushing dirty pages and logging dirty page tables.',
            estimatedMinutes: 20,
            difficulty: 'ADVANCED',
            tags: ['recovery', 'checkpointing'],
          },
          {
            conceptCode: 'C35',
            title: 'ARIES Recovery Algorithm (Analysis, Redo, Undo Phases)',
            slug: 'aries-recovery-algorithm',
            description: 'Industrial recovery gold standard: analysis phase, repeating history in redo, and rollback in undo.',
            estimatedMinutes: 30,
            difficulty: 'ADVANCED',
            tags: ['aries', 'recovery', 'algorithms'],
          },
        ],
      },
      {
        name: 'Advanced Database Systems',
        slug: 'advanced-database-systems',
        description: 'Distributed transactions, NoSQL categories, sharding, and consensus.',
        concepts: [
          {
            conceptCode: 'C36',
            title: 'Distributed Databases, 2-Phase Commit (2PC) & 3-Phase Commit (3PC)',
            slug: 'distributed-databases-2pc-3pc',
            description: 'Atomic commitment in distributed nodes, coordinator recovery, and non-blocking 3PC protocols.',
            estimatedMinutes: 25,
            difficulty: 'ADVANCED',
            tags: ['distributed', '2pc', 'consensus'],
          },
          {
            conceptCode: 'C37',
            title: 'NoSQL Architectures (Key-Value, Document, Columnar, Graph)',
            slug: 'nosql-architectures-categories',
            description: 'Comparing Redis, MongoDB, Cassandra, and Neo4j for specific data access patterns.',
            estimatedMinutes: 20,
            difficulty: 'INTERMEDIATE',
            tags: ['nosql', 'mongodb', 'cassandra'],
          },
          {
            conceptCode: 'C38',
            title: 'Sharding, Partitioning, Replication & CAP Theorem Tradeoffs',
            slug: 'sharding-replication-cap-theorem',
            description: 'Horizontal partitioning keys, master-replica sync, and consistency vs availability tradeoffs.',
            estimatedMinutes: 25,
            difficulty: 'INTERMEDIATE',
            tags: ['sharding', 'replication', 'cap-theorem'],
          },
        ],
      },
    ],
  },

  // 2. Object-Oriented Programming (24 concepts, 5 modules)
  {
    name: 'Object-Oriented Programming',
    slug: 'object-oriented-programming',
    description: 'Master classes, encapsulation, inheritance, polymorphism, memory lifecycle, SOLID, and GoF design patterns.',
    icon: 'Boxes',
    themeKey: 'oop',
    modules: [
      {
        name: 'Core OOP Paradigms',
        slug: 'core-oop-paradigms',
        description: 'Fundamental building blocks of object-oriented modeling and dispatch.',
        concepts: [
          { conceptCode: 'C39', title: 'Classes, Objects, State & Identity', slug: 'classes-objects-state-identity', description: 'Difference between class blueprints and runtime instances.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['oop', 'classes'] },
          { conceptCode: 'C40', title: 'Encapsulation & Data Hiding', slug: 'encapsulation-data-hiding', description: 'Access specifiers, invariant protection, and mutability control.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['encapsulation'] },
          { conceptCode: 'C41', title: 'Abstraction & Interface-Based Design', slug: 'abstraction-interface-design', description: 'Hiding complexity behind stable interfaces and contracts.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['abstraction'] },
          { conceptCode: 'C42', title: 'Inheritance, Types of Inheritance & Diamond Problem', slug: 'inheritance-diamond-problem', description: 'Single, multiple, multilevel inheritance, and virtual base classes.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['inheritance'] },
          { conceptCode: 'C43', title: 'Polymorphism (Compile-time vs Runtime)', slug: 'polymorphism-compile-vs-runtime', description: 'Overloading, overriding, covariant return types, and dynamic dispatch.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['polymorphism'] },
          { conceptCode: 'C44', title: 'Virtual Method Table (vtable) & Dynamic Dispatch Mechanics', slug: 'vtable-dynamic-dispatch-mechanics', description: 'How compilers implement runtime polymorphism using vtables and vptrs.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['vtable', 'internals'] },
        ],
      },
      {
        name: 'Object Lifecycle & Memory Management',
        slug: 'object-lifecycle-memory',
        description: 'Construction, destruction, garbage collection, and resource acquisition.',
        concepts: [
          { conceptCode: 'C45', title: 'Constructors, Destructors, Copy Constructors & Move Semantics', slug: 'constructors-destructors-move-semantics', description: 'Deep vs shallow copies, rvalue references, and resource transfer.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['constructors', 'lifecycle'] },
          { conceptCode: 'C46', title: 'Stack vs Heap Allocation for Objects & Object Slicing', slug: 'stack-heap-allocation-object-slicing', description: 'Value vs reference semantics and what happens when derived is assigned to base.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['memory', 'slicing'] },
          { conceptCode: 'C47', title: 'Garbage Collection Algorithms (Mark-Sweep, Generational, Reference Counting)', slug: 'garbage-collection-algorithms', description: 'Automated memory managers, stop-the-world pauses, and circular reference bugs.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['garbage-collection', 'jvm'] },
          { conceptCode: 'C48', title: 'Memory Leaks, Dangling Pointers & RAII Pattern', slug: 'memory-leaks-raii-pattern', description: 'Resource Acquisition Is Initialization in production software engineering.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['raii', 'memory-leaks'] },
        ],
      },
      {
        name: 'SOLID Design Principles',
        slug: 'solid-design-principles',
        description: 'Industry-standard guidelines for maintainable, decoupled object-oriented systems.',
        concepts: [
          { conceptCode: 'C49', title: 'Single Responsibility Principle (SRP)', slug: 'single-responsibility-principle', description: 'Cohesion, single axis of change, and refactoring God classes.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['solid', 'srp'] },
          { conceptCode: 'C50', title: 'Open/Closed Principle (OCP)', slug: 'open-closed-principle', description: 'Extending behavior via polymorphism without modifying tested code.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['solid', 'ocp'] },
          { conceptCode: 'C51', title: 'Liskov Substitution Principle (LSP) & Contract Programming', slug: 'liskov-substitution-principle', description: 'Pre-conditions cannot be strengthened, post-conditions cannot be weakened.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['solid', 'lsp'] },
          { conceptCode: 'C52', title: 'Interface Segregation Principle (ISP)', slug: 'interface-segregation-principle', description: 'Avoiding fat interfaces; clients should not depend on methods they do not call.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['solid', 'isp'] },
          { conceptCode: 'C53', title: 'Dependency Inversion Principle (DIP) & Inversion of Control (IoC)', slug: 'dependency-inversion-principle-ioc', description: 'High-level modules depending on abstractions, and dependency injection.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['solid', 'dip', 'ioc'] },
        ],
      },
      {
        name: 'Design Patterns (GoF)',
        slug: 'design-patterns-gof',
        description: 'Proven architectural solutions to recurring software engineering challenges.',
        concepts: [
          { conceptCode: 'C54', title: 'Creational Patterns: Singleton, Factory Method, Abstract Factory, Builder', slug: 'creational-design-patterns', description: 'Decoupling object instantiation and configuring complex domain models.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['design-patterns', 'creational'] },
          { conceptCode: 'C55', title: 'Structural Patterns: Adapter, Decorator, Facade, Composite', slug: 'structural-design-patterns', description: 'Composing objects into larger structures while maintaining flexibility.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['design-patterns', 'structural'] },
          { conceptCode: 'C56', title: 'Behavioral Patterns: Observer, Strategy, Command, State', slug: 'behavioral-design-patterns', description: 'Algorithms and assignment of responsibilities between cooperating objects.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['design-patterns', 'behavioral'] },
          { conceptCode: 'C57', title: 'Pattern Selection & Anti-patterns (God Object, Premature Optimization)', slug: 'pattern-selection-antipatterns', description: 'Recognizing when NOT to use patterns and refactoring bad code smells.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['antipatterns'] },
          { conceptCode: 'C58', title: 'Dependency Injection & Service Locator Mechanics', slug: 'dependency-injection-service-locator', description: 'Constructor vs setter injection and IoC container wiring.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['dependency-injection'] },
        ],
      },
      {
        name: 'Advanced OOP & Type Systems',
        slug: 'advanced-oop-type-systems',
        description: 'Modern type features, composition models, and concurrent object safety.',
        concepts: [
          { conceptCode: 'C59', title: 'Composition vs Inheritance & Has-A vs Is-A Relationships', slug: 'composition-vs-inheritance', description: 'Preferring object composition to class inheritance for decoupled designs.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['composition', 'architecture'] },
          { conceptCode: 'C60', title: 'Generics, Parametric Polymorphism & Type Erasure', slug: 'generics-type-erasure', description: 'Type parameters, variance (covariance, contravariance), and runtime implications.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['generics', 'types'] },
          { conceptCode: 'C61', title: 'Immutability, Value Objects & Records', slug: 'immutability-value-objects', description: 'Thread safety, identityless value equivalence, and functional OOP.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['immutability'] },
          { conceptCode: 'C62', title: 'Concurrency in OOP (Thread Safety, Reentrancy, Immutability)', slug: 'concurrency-in-oop-thread-safety', description: 'Race conditions, synchronized methods, reentrant locks, and immutable state.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['concurrency', 'multithreading'] },
        ],
      },
    ],
  },

  // 3. Operating Systems (40 concepts, 8 modules)
  {
    name: 'Operating Systems',
    slug: 'operating-systems',
    description: 'Hardware abstractions, processes, threads, CPU scheduling, synchronization, deadlocks, virtual memory, and file systems.',
    icon: 'Cpu',
    themeKey: 'os',
    modules: [
      {
        name: 'OS Architecture & Kernel Fundamentals',
        slug: 'os-architecture-kernel',
        description: 'Hardware-software interface, system calls, and privilege levels.',
        concepts: [
          { conceptCode: 'C63', title: 'OS Roles, Monolithic vs Microkernel vs Hybrid Architecture', slug: 'os-roles-monolithic-microkernel', description: 'Kernel topologies, IPC overhead, and attack surface tradeoffs.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['kernel', 'architecture'] },
          { conceptCode: 'C64', title: 'User Mode vs Kernel Mode & Dual-Mode Operations', slug: 'user-mode-kernel-mode-dual-mode', description: 'Privileged instructions, mode bit transitions, and CPU protection rings.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['dual-mode', 'security'] },
          { conceptCode: 'C65', title: 'System Calls, Traps, Interrupts & Context Switch Hardware Mechanics', slug: 'system-calls-traps-interrupts', description: 'Software traps, hardware interrupts, interrupt vector tables, and stack changes.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['interrupts', 'syscalls'] },
          { conceptCode: 'C66', title: 'Bootstrapping Process (BIOS/UEFI, Bootloader, Kernel Init)', slug: 'bootstrapping-process-bios-uefi', description: 'Hardware POST, MBR/GPT partitioning, GRUB, and kernel entry point.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['boot', 'kernel'] },
          { conceptCode: 'C67', title: 'System Call Interface & Privilege Rings', slug: 'syscall-interface-privilege-rings', description: 'Parameter passing conventions (registers vs stack) and x86 ring 0/ring 3.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['privilege-rings', 'x86'] },
        ],
      },
      {
        name: 'Processes & Threads',
        slug: 'processes-and-threads',
        description: 'Process life cycle, scheduling structures, multithreading models, and IPC.',
        concepts: [
          { conceptCode: 'C68', title: 'Process States, Process Control Block (PCB) & Process Memory Layout', slug: 'process-states-pcb-memory-layout', description: 'Text, Data, BSS, Heap, Stack segments, and PCB accounting fields.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['processes', 'pcb'] },
          { conceptCode: 'C69', title: 'Process Creation (fork, exec, wait, exit) & Zombie/Orphan Processes', slug: 'process-creation-fork-exec-zombie', description: 'POSIX process management, copy-on-write (COW), and init/systemd adoption.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['fork', 'exec', 'processes'] },
          { conceptCode: 'C70', title: 'Threads, Thread Control Block (TCB), User vs Kernel Threads', slug: 'threads-tcb-user-vs-kernel-threads', description: '1:1, N:1, and M:N threading models, shared address spaces, and thread overhead.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['threads', 'concurrency'] },
          { conceptCode: 'C71', title: 'Inter-Process Communication (IPC): Pipes, FIFO, Message Queues, Shared Memory', slug: 'ipc-pipes-fifo-shared-memory', description: 'Synchronous vs asynchronous IPC mechanisms and kernel involvement costs.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['ipc', 'pipes'] },
          { conceptCode: 'C72', title: 'Sockets & RPC as IPC Mechanisms', slug: 'sockets-rpc-ipc', description: 'Local UNIX domain sockets vs network sockets, marshaling, and remote calls.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['sockets', 'rpc'] },
          { conceptCode: 'C73', title: 'Context Switching Overhead & Cache Invalidation', slug: 'context-switching-overhead-cache', description: 'Saving register sets, TLB flush penalties, and cache coldness after switches.', estimatedMinutes: 20, difficulty: 'ADVANCED', tags: ['context-switch', 'performance'] },
        ],
      },
      {
        name: 'CPU Scheduling',
        slug: 'cpu-scheduling',
        description: 'Scheduling policies, fairness, latency guarantees, and multi-core allocators.',
        concepts: [
          { conceptCode: 'C74', title: 'Scheduling Criteria (Throughput, Turnaround, Waiting, Response Time)', slug: 'scheduling-criteria-metrics', description: 'Key performance equations used to evaluate algorithm efficiency.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['scheduling', 'metrics'] },
          { conceptCode: 'C75', title: 'Non-Preemptive vs Preemptive Algorithms (FCFS, SJF, SRTF)', slug: 'preemptive-scheduling-fcfs-sjf-srtf', description: 'Convoy effect in FCFS, theoretical optimality of SJF, and starvation in SRTF.', estimatedMinutes: 25, difficulty: 'BEGINNER', tags: ['scheduling', 'algorithms'] },
          { conceptCode: 'C76', title: 'Round Robin Scheduling & Time Quantum Selection', slug: 'round-robin-scheduling-time-quantum', description: 'Impact of time quantum length on response time and context switch frequency.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['round-robin'] },
          { conceptCode: 'C77', title: 'Priority Scheduling, Multilevel Queue & Multilevel Feedback Queue (MLFQ)', slug: 'mlfq-priority-scheduling', description: 'Aging to prevent starvation, multiple priority queues, and dynamic priority adjustment.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['mlfq', 'scheduling'] },
          { conceptCode: 'C78', title: 'Real-Time Scheduling (Rate Monotonic, Earliest Deadline First)', slug: 'real-time-scheduling-edf-rm', description: 'Hard vs soft real-time systems, deadline guarantees, and schedulability bounds.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['real-time', 'edf'] },
        ],
      },
      {
        name: 'Process Synchronization & Concurrency',
        slug: 'process-synchronization',
        description: 'Race conditions, critical sections, semaphores, monitors, and lock primitives.',
        concepts: [
          { conceptCode: 'C79', title: "Critical Section Problem & Peterson's Algorithm", slug: 'critical-section-peterson-algorithm', description: 'Mutual exclusion, progress, and bounded waiting requirements.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['concurrency', 'synchronization'] },
          { conceptCode: 'C80', title: 'Hardware Synchronization (Test-and-Set, Compare-and-Swap, Memory Barriers)', slug: 'hardware-synchronization-cas', description: 'Atomic CPU instructions, lock-free algorithms, and memory ordering.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['cas', 'atomic', 'hardware'] },
          { conceptCode: 'C81', title: 'Mutexes, Spinlocks & Counting/Binary Semaphores', slug: 'mutexes-spinlocks-semaphores', description: 'Sleep-locks vs busy-waiting, wait() and signal() semaphore mechanics.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['mutex', 'semaphore'] },
          { conceptCode: 'C82', title: 'Classic Synchronization Problems: Producer-Consumer, Readers-Writers, Dining Philosophers', slug: 'classic-synchronization-problems', description: 'Canonical concurrency challenges and deadlock-free solutions.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['producer-consumer', 'concurrency'] },
          { conceptCode: 'C83', title: 'Monitors & Condition Variables', slug: 'monitors-condition-variables', description: 'High-level language synchronization constructs, Hoare vs Mesa semantics.', estimatedMinutes: 20, difficulty: 'ADVANCED', tags: ['monitors', 'condition-variables'] },
          { conceptCode: 'C84', title: 'Thread Safety, Deadlock vs Livelock vs Starvation', slug: 'thread-safety-deadlock-livelock-starvation', description: 'Comparing different starvation and lock-inversion conditions.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['thread-safety', 'deadlock'] },
        ],
      },
      {
        name: 'Deadlocks',
        slug: 'deadlocks',
        description: 'Necessary conditions, resource graphs, Banker algorithm, and recovery.',
        concepts: [
          { conceptCode: 'C85', title: 'Coffman Conditions for Deadlock', slug: 'coffman-conditions-deadlock', description: 'Mutual exclusion, hold and wait, no preemption, and circular wait.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['deadlock', 'coffman'] },
          { conceptCode: 'C86', title: 'Resource Allocation Graph (RAG) & Cycle Detection', slug: 'resource-allocation-graph-cycle-detection', description: 'Claim edges, request edges, assignment edges, and cycle analysis for single vs multi-instance resources.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['rag', 'graph'] },
          { conceptCode: 'C87', title: "Deadlock Avoidance: Banker's Algorithm (Safety & Request Algorithms)", slug: 'bankers-algorithm-deadlock-avoidance', description: 'Safe vs unsafe states, matrix computations (Allocation, Max, Available, Need).', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['bankers-algorithm'] },
          { conceptCode: 'C88', title: 'Deadlock Detection & Recovery Strategies', slug: 'deadlock-detection-recovery', description: 'Periodic graph reduction, process termination criteria, and resource preemption rollback.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['deadlock-recovery'] },
        ],
      },
      {
        name: 'Memory Management & Virtual Memory',
        slug: 'memory-management-virtual-memory',
        description: 'Paging, TLB, segmentation, page faults, and replacement policies.',
        concepts: [
          { conceptCode: 'C89', title: 'Logical vs Physical Address Space & Memory Management Unit (MMU)', slug: 'logical-vs-physical-address-mmu', description: 'Base and limit registers, address binding, and hardware translation.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['mmu', 'memory'] },
          { conceptCode: 'C90', title: 'Contiguous Memory Allocation, Fragmentation (Internal vs External), Compaction', slug: 'contiguous-allocation-fragmentation', description: 'First-fit, best-fit, worst-fit allocation strategies and fragmentation remedies.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['fragmentation', 'memory'] },
          { conceptCode: 'C91', title: 'Paging Architecture, Page Table Structure & Multi-Level Page Tables', slug: 'paging-architecture-multilevel-page-tables', description: 'Page numbers, offsets, page frames, and hierarchical page tables.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['paging', 'page-table'] },
          { conceptCode: 'C92', title: 'Translation Lookaside Buffer (TLB) Hit/Miss Ratios & Effective Access Time', slug: 'tlb-translation-lookaside-buffer', description: 'Associative hardware caching of translations and EAT calculations.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['tlb', 'caching'] },
          { conceptCode: 'C93', title: 'Segmentation vs Paging Tradeoffs', slug: 'segmentation-vs-paging', description: 'Programmer logical view vs hardware physical partition schemes.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['segmentation', 'paging'] },
          { conceptCode: 'C94', title: 'Virtual Memory, Demand Paging, Page Fault Handling Flow', slug: 'virtual-memory-demand-paging-page-fault', description: 'Step-by-step interrupt handler flow from page fault trap to disk I/O and frame update.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['virtual-memory', 'page-fault'] },
          { conceptCode: 'C95', title: "Page Replacement Algorithms (FIFO, LRU, Optimal, Clock) & Belady's Anomaly / Thrashing", slug: 'page-replacement-algorithms-belady-thrashing', description: 'Comparing algorithm eviction decisions, stack algorithms, working-set models, and thrashing.', estimatedMinutes: 30, difficulty: 'ADVANCED', tags: ['page-replacement', 'lru', 'thrashing'] },
        ],
      },
      {
        name: 'Storage & File Systems',
        slug: 'storage-file-systems',
        description: 'Disks, inodes, file allocation, and journaling crash consistency.',
        concepts: [
          { conceptCode: 'C96', title: 'Disk Scheduling Algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK)', slug: 'disk-scheduling-algorithms', description: 'Minimizing seek time and rotational latency on mechanical and solid-state storage.', estimatedMinutes: 25, difficulty: 'BEGINNER', tags: ['disk-scheduling', 'storage'] },
          { conceptCode: 'C97', title: 'File System Layout, Inodes, Directory Structures & Hard vs Soft Links', slug: 'file-system-layout-inodes-links', description: 'Superblock, inode tables, reference counts, and symbolic vs hard links.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['inodes', 'file-systems'] },
          { conceptCode: 'C98', title: 'File Allocation Methods (Contiguous, Linked, Indexed / Inode Tree)', slug: 'file-allocation-methods', description: 'Direct blocks, indirect blocks, double/triple indirect pointers, and FAT systems.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['allocation', 'storage'] },
          { conceptCode: 'C99', title: 'Journaling File Systems, VFS Abstraction & Crash Consistency', slug: 'journaling-file-systems-vfs', description: 'Ext4, XFS journaling, write order, fsync, and Virtual File System abstraction.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['journaling', 'vfs'] },
        ],
      },
      {
        name: 'Security & Protection',
        slug: 'os-security-protection',
        description: 'Access matrices, principle of least privilege, and buffer exploits.',
        concepts: [
          { conceptCode: 'C100', title: 'Protection Domains, Access Matrix & ACL vs Capabilities', slug: 'protection-domains-access-matrix-acl', description: 'Column-wise Access Control Lists vs row-wise Capability Lists.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['security', 'acl'] },
          { conceptCode: 'C101', title: 'Authentication, Authorization & Principle of Least Privilege', slug: 'authentication-authorization-least-privilege', description: 'Role-based access, setuid permissions, and sandboxing.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['security', 'auth'] },
          { conceptCode: 'C102', title: 'Buffer Overflow Vulnerabilities & Stack Canaries / ASLR', slug: 'buffer-overflow-stack-canaries-aslr', description: 'Overwriting return instruction pointers, shellcode injection, and OS memory mitigations.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['buffer-overflow', 'security'] },
        ],
      },
    ],
  },

  // 4. Computer Networks (25 concepts, 6 modules)
  {
    name: 'Computer Networks',
    slug: 'computer-networks',
    description: 'OSI & TCP/IP stacks, physical layer, IP routing, TCP reliable flow control, DNS, HTTP, TLS, and security.',
    icon: 'Network',
    themeKey: 'cn',
    modules: [
      {
        name: 'Network Fundamentals & Reference Models',
        slug: 'network-fundamentals-models',
        description: 'Packet switching, protocol layering, and network latency.',
        concepts: [
          { conceptCode: 'C103', title: 'Network Topologies, Packet Switching vs Circuit Switching', slug: 'topologies-packet-vs-circuit-switching', description: 'Statistical multiplexing, store-and-forward delay, and dedicated circuits.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['packet-switching', 'networking'] },
          { conceptCode: 'C104', title: 'OSI 7-Layer Reference Model & Responsibilities', slug: 'osi-7-layer-reference-model', description: 'Physical, Data Link, Network, Transport, Session, Presentation, Application duties.', estimatedMinutes: 25, difficulty: 'BEGINNER', tags: ['osi-model'] },
          { conceptCode: 'C105', title: 'TCP/IP 4-Layer Architecture & Protocol Encapsulation/Decapsulation', slug: 'tcp-ip-4-layer-encapsulation', description: 'Headers, payloads, trailers, MTU, and end-to-end packet journey.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['tcp-ip', 'encapsulation'] },
          { conceptCode: 'C106', title: 'Network Performance Metrics: Bandwidth, Latency, Throughput, Jitter, RTT', slug: 'network-performance-metrics-rtt', description: 'Transmission vs propagation vs queuing delay equations.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['latency', 'throughput'] },
        ],
      },
      {
        name: 'Physical & Data Link Layer',
        slug: 'physical-data-link-layer',
        description: 'Framing, error detection, MAC addressing, and local networks.',
        concepts: [
          { conceptCode: 'C107', title: 'Framing, Error Detection (Parity, Checksum, CRC) & Error Correction (Hamming)', slug: 'framing-error-detection-crc-hamming', description: 'Bit stuffing, byte stuffing, polynomial division in CRC, and Hamming code distance.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['crc', 'framing'] },
          { conceptCode: 'C108', title: 'Flow Control: Stop-and-Wait, Go-Back-N, Selective Repeat ARQ', slug: 'flow-control-stop-wait-gbn-sr', description: 'Sliding window sizes, timeouts, ACK/NACK mechanics, and channel efficiency.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['flow-control', 'arq'] },
          { conceptCode: 'C109', title: 'MAC Sublayer: CSMA/CD (Ethernet) & CSMA/CA (Wi-Fi)', slug: 'mac-csma-cd-csma-ca', description: 'Collision detection with exponential backoff vs collision avoidance with RTS/CTS.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['csma', 'ethernet'] },
          { conceptCode: 'C110', title: 'Ethernet Frame, MAC Addressing, ARP Protocol & ARP Cache Poisoning', slug: 'ethernet-mac-arp-poisoning', description: 'Resolving IP to hardware addresses, ARP requests/replies, and spoofing attacks.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['arp', 'mac-address'] },
        ],
      },
      {
        name: 'Network Layer & Routing',
        slug: 'network-layer-routing',
        description: 'IP addressing, subnetting, CIDR, and routing algorithms.',
        concepts: [
          { conceptCode: 'C111', title: 'IPv4 Addressing, Subnetting, CIDR & Variable Length Subnet Masking (VLSM)', slug: 'ipv4-subnetting-cidr-vlsm', description: 'Classless Inter-Domain Routing, subnet mask math, and prefix allocation.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['ipv4', 'subnetting', 'cidr'] },
          { conceptCode: 'C112', title: 'IPv6 Architecture, Header Simplification & Migration Strategies', slug: 'ipv6-architecture-migration', description: '128-bit addresses, fixed 40-byte base header, SLAAC, and dual-stack.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['ipv6'] },
          { conceptCode: 'C113', title: 'Routing Algorithms: Distance Vector (Bellman-Ford, Count to Infinity) & Link State (Dijkstra)', slug: 'routing-distance-vector-link-state', description: 'Split horizon, poison reverse, and shortest-path tree construction.', estimatedMinutes: 30, difficulty: 'ADVANCED', tags: ['routing', 'dijkstra', 'bellman-ford'] },
          { conceptCode: 'C114', title: 'Routing Protocols: RIP, OSPF, BGP & Autonomous Systems', slug: 'routing-protocols-rip-ospf-bgp', description: 'Intra-domain vs inter-domain routing, path vector policy, and peering.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['bgp', 'ospf', 'rip'] },
          { conceptCode: 'C115', title: 'ICMP, Ping, Traceroute, NAT & DHCP Mechanics', slug: 'icmp-ping-traceroute-nat-dhcp', description: 'Control messages, TTL decrements in traceroute, port address translation, and DORA process.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['nat', 'dhcp', 'icmp'] },
        ],
      },
      {
        name: 'Transport Layer',
        slug: 'transport-layer',
        description: 'End-to-end communication, TCP handshake, reliability, and congestion.',
        concepts: [
          { conceptCode: 'C116', title: 'Port Numbers, Sockets & Multiplexing / Demultiplexing', slug: 'port-numbers-sockets-multiplexing', description: 'Ephemeral ports, well-known ports, and socket 5-tuple identification.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['sockets', 'ports'] },
          { conceptCode: 'C117', title: 'UDP Protocol: Header Format, Use Cases & Checksum Mechanics', slug: 'udp-protocol-header-usecases', description: 'Connectionless, lightweight datagram transport for DNS, gaming, and streaming.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['udp'] },
          { conceptCode: 'C118', title: 'TCP Segment Format & 3-Way Handshake / Connection Teardown (FIN/ACK, TIME_WAIT)', slug: 'tcp-handshake-connection-teardown-time-wait', description: 'SYN, ACK, sequence numbering, simultaneous close, and TIME_WAIT state purpose.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['tcp', 'handshake', 'time-wait'] },
          { conceptCode: 'C119', title: 'TCP Reliable Data Transfer & Sliding Window Flow Control', slug: 'tcp-reliable-transfer-sliding-window', description: 'Cumulative ACKs, receive window advertising (rwnd), and Silly Window syndrome.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['tcp', 'sliding-window'] },
          { conceptCode: 'C120', title: 'TCP Congestion Control: Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery', slug: 'tcp-congestion-control-reno-cubic', description: 'Congestion window (cwnd), ssthresh, AIMD algorithm, and packet loss signals.', estimatedMinutes: 30, difficulty: 'ADVANCED', tags: ['tcp', 'congestion-control'] },
          { conceptCode: 'C121', title: 'TCP vs UDP In-Depth Comparison & Real-Time Protocol Tradeoffs', slug: 'tcp-vs-udp-tradeoffs', description: 'Head-of-line blocking, latency overhead, and transport protocol decision trees.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['tcp-vs-udp'] },
        ],
      },
      {
        name: 'Application Layer Protocols',
        slug: 'application-layer-protocols',
        description: 'DNS, HTTP evolution, TLS security, and real-time bidirectional protocols.',
        concepts: [
          { conceptCode: 'C122', title: 'DNS Architecture, Recursive vs Iterative Queries, Record Types (A, CNAME, MX, TXT)', slug: 'dns-architecture-query-resolution', description: 'Root servers, TLD servers, authoritative servers, TTL, and DNS caching.', estimatedMinutes: 25, difficulty: 'BEGINNER', tags: ['dns'] },
          { conceptCode: 'C123', title: 'HTTP/1.1 vs HTTP/2 (Multiplexing, Header Compression) vs HTTP/3 (QUIC, UDP)', slug: 'http1-http2-http3-quic', description: 'Pipelining limits, binary framing, HPACK, and 0-RTT handshakes over QUIC.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['http', 'http2', 'http3', 'quic'] },
          { conceptCode: 'C124', title: 'HTTPS, SSL/TLS Handshake, Digital Certificates & Public Key Infrastructure', slug: 'https-tls-handshake-pki', description: 'Symmetric session keys, asymmetric key exchange, certificate authorities, and forward secrecy.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['https', 'tls', 'security'] },
          { conceptCode: 'C125', title: 'WebSockets, Server-Sent Events (SSE) & Long Polling', slug: 'websockets-sse-long-polling', description: 'Full-duplex TCP connections vs unidirectional streams and push architectures.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['websockets', 'sse'] },
        ],
      },
      {
        name: 'Network Security',
        slug: 'network-security',
        description: 'Perimeter firewalls and mitigating common layer 3/4 network attacks.',
        concepts: [
          { conceptCode: 'C126', title: 'Firewalls (Packet Filtering, Stateful, Next-Gen) & NAT Gateways', slug: 'firewalls-packet-filtering-stateful', description: 'Inspecting connection tracking states and application-layer traffic.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['firewalls', 'security'] },
          { conceptCode: 'C127', title: 'Network Attacks: DDoS, SYN Flood, Man-in-the-Middle (MitM), DNS Spoofing', slug: 'network-attacks-ddos-syn-flood', description: 'Attack vectors, SYN cookies, amplification techniques, and defense strategies.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['attacks', 'ddos', 'security'] },
        ],
      },
    ],
  },

  // 5. DevOps and Software Delivery (23 concepts, 5 modules)
  {
    name: 'DevOps and Software Delivery',
    slug: 'devops-software-delivery',
    description: 'Git internals, CI/CD pipelines, automated testing, Docker containers, Kubernetes orchestration, and observability.',
    icon: 'GitBranch',
    themeKey: 'devops',
    modules: [
      {
        name: 'Version Control & Git Internals',
        slug: 'git-internals-vcs',
        description: 'Content-addressable storage, branching mechanics, and merge algorithms.',
        concepts: [
          { conceptCode: 'C128', title: 'Git Architecture (Working Dir, Staging Area, Local/Remote Repo)', slug: 'git-architecture-working-tree-staging', description: 'The three states of code and lifecycle of tracked files.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['git', 'vcs'] },
          { conceptCode: 'C129', title: 'Git Object Model: Blobs, Trees, Commits, Tags & SHA-1 Hashing', slug: 'git-object-model-blobs-trees', description: 'Inside .git/objects: DAG structure, packfiles, and immutability.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['git', 'internals'] },
          { conceptCode: 'C130', title: 'Branching Strategies: GitFlow, Trunk-Based Development, Feature Branching', slug: 'git-branching-strategies-trunk-based', description: 'Release cadences, short-lived feature branches, and continuous delivery compatibility.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['git', 'trunk-based'] },
          { conceptCode: 'C131', title: 'Git Merge vs Rebase, Cherry-Pick & Conflict Resolution', slug: 'git-merge-vs-rebase-cherry-pick', description: 'Linear git history vs true historical merges and interactive rebasing.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['git', 'rebase', 'merge'] },
          { conceptCode: 'C132', title: 'Git Hooks, Submodules & Monorepo Tooling', slug: 'git-hooks-submodules-monorepo', description: 'Pre-commit verification, package workspace orchestration, and repository boundaries.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['git', 'monorepo'] },
        ],
      },
      {
        name: 'CI/CD Pipelines',
        slug: 'cicd-pipelines',
        description: 'Automated test runners, delivery stages, and deployment strategies.',
        concepts: [
          { conceptCode: 'C133', title: 'Continuous Integration (CI) Principles: Automated Testing, Linting, Artifact Building', slug: 'ci-principles-automated-testing', description: 'Fast feedback loops, build matrix runs, and shift-left testing.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['ci', 'testing'] },
          { conceptCode: 'C134', title: 'Continuous Delivery vs Continuous Deployment (CD)', slug: 'continuous-delivery-vs-deployment', description: 'Manual promotion gates vs fully automated zero-touch production releases.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['cd', 'devops'] },
          { conceptCode: 'C135', title: 'Pipeline as Code (GitHub Actions, GitLab CI, Jenkinsfile)', slug: 'pipeline-as-code-github-actions', description: 'Declarative workflows, runners, environment secrets, and dependency caching.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['github-actions', 'pipelines'] },
          { conceptCode: 'C136', title: 'Deployment Strategies: Blue/Green, Canary, Rolling Updates, Feature Flags', slug: 'deployment-strategies-blue-green-canary', description: 'Zero-downtime releases, traffic shifting, automated rollbacks, and kill switches.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['blue-green', 'canary', 'deployments'] },
          { conceptCode: 'C137', title: 'Artifact Repositories & Semantic Versioning', slug: 'artifact-repositories-semantic-versioning', description: 'Container registries, NPM/Maven packages, and SemVer Major.Minor.Patch rules.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['artifacts', 'semver'] },
        ],
      },
      {
        name: 'Containerization & Docker',
        slug: 'containerization-docker',
        description: 'Linux namespaces, Dockerfiles, images, networking, and volumes.',
        concepts: [
          { conceptCode: 'C138', title: 'Virtual Machines vs Containers (cgroups, namespaces, chroot)', slug: 'vm-vs-containers-cgroups-namespaces', description: 'Hypervisor overhead vs Linux kernel isolation primitives.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['docker', 'containers'] },
          { conceptCode: 'C139', title: 'Dockerfile Optimization: Multi-stage Builds, Layer Caching, Base Images', slug: 'dockerfile-optimization-multistage', description: 'Minimizing image size, cache invalidation rules, and Alpine/Distroless bases.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['docker', 'dockerfile'] },
          { conceptCode: 'C140', title: 'Docker Networking (Bridge, Host, Overlay) & Storage (Volumes, Bind Mounts)', slug: 'docker-networking-storage-volumes', description: 'Inter-container communication and persistent data lifecycles.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['docker', 'networking'] },
          { conceptCode: 'C141', title: 'Docker Compose for Multi-Container Local Orchestration', slug: 'docker-compose-orchestration', description: 'Service definitions, networks, environment files, and healthcheck dependencies.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['docker-compose'] },
          { conceptCode: 'C142', title: 'Container Security: Rootless Containers, Vulnerability Scanning', slug: 'container-security-vulnerability-scanning', description: 'Non-root users, CVE scanning with Trivy, and image signing.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['security', 'docker'] },
        ],
      },
      {
        name: 'Container Orchestration & Kubernetes',
        slug: 'container-orchestration-kubernetes',
        description: 'Cluster topology, declarative reconciliation, Pods, and Services.',
        concepts: [
          { conceptCode: 'C143', title: 'Kubernetes Architecture: Control Plane & Worker Nodes', slug: 'kubernetes-architecture-control-plane-workers', description: 'etcd consensus, kube-apiserver, kube-scheduler, kube-controller-manager, and kubelet.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['kubernetes', 'k8s'] },
          { conceptCode: 'C144', title: 'Core K8s Objects: Pods, Deployments, ReplicaSets, Namespaces', slug: 'k8s-core-objects-pods-deployments', description: 'Atomic units of deployment, self-healing replica loops, and declarative rollout specs.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['k8s', 'pods', 'deployments'] },
          { conceptCode: 'C145', title: 'K8s Networking & Services: ClusterIP, NodePort, LoadBalancer, Ingress', slug: 'k8s-services-networking-ingress', description: 'Service discovery, kube-proxy iptables/IPVS rules, and Layer 7 Ingress routing.', estimatedMinutes: 30, difficulty: 'ADVANCED', tags: ['k8s', 'networking', 'ingress'] },
          { conceptCode: 'C146', title: 'ConfigMaps, Secrets, Volumes & PersistentVolumeClaims (PVC)', slug: 'k8s-configmaps-secrets-storage', description: 'Decoupling application configuration, base64 secrets, CSI drivers, and storage classes.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['k8s', 'storage', 'secrets'] },
        ],
      },
      {
        name: 'Infrastructure as Code & Observability',
        slug: 'iac-and-observability',
        description: 'Declarative infra, telemetry signals, monitoring, and uptime contracts.',
        concepts: [
          { conceptCode: 'C147', title: 'Infrastructure as Code (IaC) Concepts: Declarative vs Imperative (Terraform)', slug: 'iac-concepts-terraform', description: 'State management, execution plans, and reproducible cloud environments.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['iac', 'terraform'] },
          { conceptCode: 'C148', title: 'Immutable Infrastructure & Configuration Drift', slug: 'immutable-infrastructure-configuration-drift', description: 'Replacing instances rather than patching running servers to prevent snowflake bugs.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['immutable-infrastructure'] },
          { conceptCode: 'C149', title: 'The Three Pillars of Observability: Metrics, Logs, Traces', slug: 'observability-metrics-logs-traces', description: 'Time-series counters (Prometheus), structured logging, and distributed trace spans.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['observability', 'telemetry'] },
          { conceptCode: 'C150', title: 'Health Checks: Liveness vs Readiness Probes & SLA/SLO/SLI Definitions', slug: 'health-checks-probes-sla-slo-sli', description: 'Self-healing restarts vs traffic removal, error budgets, and reliability metrics.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['sla', 'slo', 'probes'] },
        ],
      },
    ],
  },

  // 6. Computer Architecture (2 concepts, 1 module)
  {
    name: 'Computer Architecture',
    slug: 'computer-architecture',
    description: 'Hardware foundations: CPU execution cycles, instruction pipelining, hazards, and memory cache hierarchies.',
    icon: 'Layers',
    themeKey: 'ca',
    modules: [
      {
        name: 'Processor & Memory Hierarchy Fundamentals',
        slug: 'processor-memory-hierarchy',
        description: 'Execution pipelining and memory cache coherency.',
        concepts: [
          {
            conceptCode: 'C151',
            title: 'Von Neumann vs Harvard Architecture, CPU Execution Cycle & Pipelining Hazards',
            slug: 'von-neumann-cpu-cycle-pipelining-hazards',
            description: 'Fetch-Decode-Execute stages, structural, data (RAW, WAR, WAW), and control branching hazards.',
            estimatedMinutes: 30,
            difficulty: 'INTERMEDIATE',
            tags: ['cpu', 'pipelining', 'hazards', 'architecture'],
          },
          {
            conceptCode: 'C152',
            title: 'Cache Memory Hierarchy (L1/L2/L3), Cache Coherence (MESI) & Locality of Reference',
            slug: 'cache-hierarchy-mesi-coherence-locality',
            description: 'Temporal and spatial locality, direct vs set-associative caches, and Modified-Exclusive-Shared-Invalid protocol.',
            estimatedMinutes: 30,
            difficulty: 'ADVANCED',
            tags: ['cache', 'mesi', 'hardware', 'locality'],
          },
        ],
      },
    ],
  },

  // 7. System Design Fundamentals (9 concepts, 3 modules)
  {
    name: 'System Design Fundamentals',
    slug: 'system-design-fundamentals',
    description: 'Scalability patterns, load balancing, caching, sharding, distributed consensus, and resilience.',
    icon: 'Server',
    themeKey: 'sd',
    modules: [
      {
        name: 'Scalability, Availability & Tradeoffs',
        slug: 'scalability-availability-tradeoffs',
        description: 'Scaling axes, load distribution, and distributed theoretical bounds.',
        concepts: [
          { conceptCode: 'C153', title: 'Vertical vs Horizontal Scaling, Load Balancing Algorithms & Consistent Hashing', slug: 'scaling-load-balancing-consistent-hashing', description: 'Round robin, least connections, hash rings, virtual nodes, and minimal remapping.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['scalability', 'load-balancing', 'consistent-hashing'] },
          { conceptCode: 'C154', title: 'High Availability, Fault Tolerance, Redundancy, Failover & MTBF/MTTR', slug: 'high-availability-fault-tolerance-mtbf', description: 'Nines of availability (99.9% vs 99.999%), active-passive vs active-active clusters.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['availability', 'reliability'] },
          { conceptCode: 'C155', title: 'CAP Theorem & PACELC Theorem in Distributed Systems', slug: 'cap-pacelc-theorems', description: 'Partition tolerance, latency vs consistency tradeoffs during normal operations.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['cap-theorem', 'pacelc'] },
        ],
      },
      {
        name: 'Data Storage & Caching at Scale',
        slug: 'caching-and-storage-at-scale',
        description: 'Caching tiers, invalidation strategies, database sharding, and CDNs.',
        concepts: [
          { conceptCode: 'C156', title: 'Caching Strategies: Cache-Aside, Write-Through, Write-Behind & Eviction (LRU, LFU)', slug: 'caching-strategies-eviction-policies', description: 'Cache stampede mitigation, dogpiling prevention, and cache hit ratio maximization.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['caching', 'redis', 'lru'] },
          { conceptCode: 'C157', title: 'Database Sharding, Partitioning Keys, Resharding & Replication Lag', slug: 'database-sharding-keys-replication-lag', description: 'Horizontal sharding schemes, hotspot mitigation, cross-shard queries, and read replicas.', estimatedMinutes: 30, difficulty: 'ADVANCED', tags: ['sharding', 'replication'] },
          { conceptCode: 'C158', title: 'Content Delivery Networks (CDNs) & Edge Caching Architecture', slug: 'cdn-edge-caching-architecture', description: 'Points of presence (PoP), Anycast DNS, SSL termination at edge, and dynamic route optimization.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['cdn', 'edge'] },
        ],
      },
      {
        name: 'Distributed Communication & Resilience',
        slug: 'distributed-communication-resilience',
        description: 'Async queues, rate limiting algorithms, and circuit breakers.',
        concepts: [
          { conceptCode: 'C159', title: 'Synchronous vs Asynchronous Communication: REST, gRPC, Message Queues (Kafka, RabbitMQ)', slug: 'sync-vs-async-rest-grpc-kafka', description: 'Point-to-point queues vs distributed append-only commit logs and consumer groups.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['kafka', 'rabbitmq', 'grpc'] },
          { conceptCode: 'C160', title: 'Rate Limiting Algorithms: Token Bucket, Leaky Bucket, Sliding Window Log', slug: 'rate-limiting-algorithms-token-bucket', description: 'Protecting downstream services from starvation and distributed Redis counters.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['rate-limiting', 'algorithms'] },
          { conceptCode: 'C161', title: 'Distributed Resilience Patterns: Circuit Breaker, Bulkhead, Retry with Backoff & Jitter', slug: 'resilience-circuit-breaker-backoff-jitter', description: 'Preventing cascading failures in microservices and thundering herd problem solutions.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['circuit-breaker', 'resilience'] },
        ],
      },
    ],
  },

  // 8. GenAI and AI Fundamentals (23 concepts, 6 modules)
  {
    name: 'GenAI and AI Fundamentals',
    slug: 'genai-ai-fundamentals',
    description: 'Machine learning fundamentals, transformer architectures, LLM fine-tuning, RAG pipelines, prompt engineering, and autonomous agents.',
    icon: 'Sparkles',
    themeKey: 'ai',
    modules: [
      {
        name: 'Foundations of Machine Learning & Neural Networks',
        slug: 'ml-neural-network-foundations',
        description: 'Learning paradigms, perceptrons, loss gradients, and regularization.',
        concepts: [
          { conceptCode: 'C162', title: 'Supervised vs Unsupervised vs Reinforcement Learning Paradigms', slug: 'ml-paradigms-supervised-unsupervised-rl', description: 'Labeled regression/classification, clustering, and reward-driven agents.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['ml', 'paradigms'] },
          { conceptCode: 'C163', title: 'Artificial Neural Networks (ANN): Perceptrons, Activation Functions, Forward & Backpropagation', slug: 'ann-perceptrons-backpropagation', description: 'Chain rule of calculus, non-linear activations (ReLU, GELU, Sigmoid), and gradient descent.', estimatedMinutes: 30, difficulty: 'INTERMEDIATE', tags: ['neural-networks', 'backpropagation'] },
          { conceptCode: 'C164', title: 'Loss Functions & Optimizers (SGD, Adam)', slug: 'loss-functions-optimizers-sgd-adam', description: 'Cross-entropy, MSE, learning rate schedules, and adaptive momentum.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['optimizers', 'adam'] },
          { conceptCode: 'C165', title: 'Overfitting vs Underfitting, Bias-Variance Tradeoff & Regularization (Dropout, L1/L2)', slug: 'bias-variance-regularization-dropout', description: 'Generalization error, weight decay penalties, and validation curve diagnosis.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['regularization', 'dropout'] },
        ],
      },
      {
        name: 'Deep Learning & Natural Language Processing',
        slug: 'deep-learning-nlp-transformers',
        description: 'Embeddings, attention mechanics, and transformer blocks.',
        concepts: [
          { conceptCode: 'C166', title: 'Word Embeddings (Word2Vec, GloVe) & Vector Spaces', slug: 'word-embeddings-word2vec-vectors', description: 'Continuous bag of words, skip-gram, cosine similarity, and semantic geometry.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['embeddings', 'nlp'] },
          { conceptCode: 'C167', title: 'Recurrent Neural Networks (RNN) & LSTMs / GRUs Limitations', slug: 'rnn-lstm-gru-limitations', description: 'Vanishing gradients, hidden state bottlenecks, and sequential computation limitations.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['rnn', 'lstm'] },
          { conceptCode: 'C168', title: 'The Transformer Architecture: Self-Attention, Multi-Head Attention, Positional Encoding', slug: 'transformer-architecture-self-attention', description: 'Scaled dot-product attention QKV, parallel training, and sinusoids/RoPE position encodings.', estimatedMinutes: 35, difficulty: 'ADVANCED', tags: ['transformers', 'attention', 'deep-learning'] },
          { conceptCode: 'C169', title: 'Encoder-Only (BERT) vs Decoder-Only (GPT) vs Encoder-Decoder (T5) Models', slug: 'encoder-vs-decoder-models-bert-gpt', description: 'Masked language modeling, autoregressive causal generation, and sequence-to-sequence.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['bert', 'gpt', 'llm'] },
        ],
      },
      {
        name: 'Large Language Models (LLMs)',
        slug: 'large-language-models',
        description: 'Pre-training, tokenization, instruction tuning, and alignment.',
        concepts: [
          { conceptCode: 'C170', title: 'Pre-training, Tokenization (BPE, WordPiece) & Context Windows', slug: 'pretraining-tokenization-bpe', description: 'Byte pair encoding, token byte vocabulary, scaling laws, and context limits.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['tokenization', 'llm'] },
          { conceptCode: 'C171', title: 'Supervised Fine-Tuning (SFT) & Instruction Tuning', slug: 'supervised-fine-tuning-instruction-tuning', description: 'Formatting prompt-completion datasets to teach models task execution.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['fine-tuning', 'sft'] },
          { conceptCode: 'C172', title: 'RLHF (Reinforcement Learning from Human Feedback) & DPO', slug: 'rlhf-dpo-alignment', description: 'Reward models, PPO policy optimization, and Direct Preference Optimization.', estimatedMinutes: 30, difficulty: 'ADVANCED', tags: ['rlhf', 'dpo', 'alignment'] },
          { conceptCode: 'C173', title: 'Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA)', slug: 'peft-lora-qlora-finetuning', description: 'Low-rank matrix decomposition of attention weights and 4-bit quantized adapters.', estimatedMinutes: 30, difficulty: 'ADVANCED', tags: ['lora', 'qlora', 'peft'] },
        ],
      },
      {
        name: 'Retrieval-Augmented Generation (RAG)',
        slug: 'retrieval-augmented-generation',
        description: 'Ingestion, vector chunking, indexing, and semantic retrieval.',
        concepts: [
          { conceptCode: 'C174', title: 'RAG Architecture: Ingestion, Chunking Strategies, Embedding & Retrieval', slug: 'rag-architecture-chunking-retrieval', description: 'Recursive character vs semantic chunking, embedding generation, and contextual injection.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['rag', 'embeddings'] },
          { conceptCode: 'C175', title: 'Vector Databases: Indexing (HNSW, IVF) & Similarity Metrics (Cosine, Dot Product)', slug: 'vector-databases-hnsw-indexing', description: 'Approximate Nearest Neighbor search, graph-based indices, and distance calculations.', estimatedMinutes: 30, difficulty: 'ADVANCED', tags: ['vector-db', 'hnsw'] },
          { conceptCode: 'C176', title: 'Hybrid Search: Dense Vector + Sparse Lexical (BM25) Retrieval & Re-ranking', slug: 'hybrid-search-bm25-reranking', description: 'Reciprocal Rank Fusion (RRF) and cross-encoder re-ranking models.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['hybrid-search', 'bm25', 'reranking'] },
          { conceptCode: 'C177', title: 'Advanced RAG: Query Transformation, Context Compression, Evaluation (Ragas)', slug: 'advanced-rag-query-expansion-ragas', description: 'Hypothetical Document Embeddings (HyDE), context relevancy, faithfulness, and answer correctness.', estimatedMinutes: 25, difficulty: 'ADVANCED', tags: ['rag', 'evaluation'] },
        ],
      },
      {
        name: 'Prompt Engineering & LLM Inference',
        slug: 'prompt-engineering-inference',
        description: 'Prompt design, generation sampling parameters, hallucinations, and inference speed.',
        concepts: [
          { conceptCode: 'C178', title: 'Prompt Techniques: Zero-Shot, Few-Shot, Chain-of-Thought (CoT), ReAct', slug: 'prompt-techniques-few-shot-cot-react', description: 'Reasoning scaffolds, in-context learning, and Thought-Action-Observation loops.', estimatedMinutes: 20, difficulty: 'BEGINNER', tags: ['prompting', 'cot', 'react'] },
          { conceptCode: 'C179', title: 'Decoding Parameters: Temperature, Top-P, Top-K, Repetition Penalty', slug: 'llm-decoding-parameters-temperature-top-p', description: 'Probability distribution shaping, nucleus sampling, and deterministic outputs.', estimatedMinutes: 15, difficulty: 'BEGINNER', tags: ['sampling', 'temperature'] },
          { conceptCode: 'C180', title: 'Hallucinations in LLMs: Root Causes, Detection & Grounding Techniques', slug: 'llm-hallucinations-causes-grounding', description: 'Parametric memory vs factual retrieval, citation verification, and self-consistency.', estimatedMinutes: 20, difficulty: 'INTERMEDIATE', tags: ['hallucinations', 'grounding'] },
          { conceptCode: 'C181', title: 'LLM Inference Optimization: KV Caching, Quantization (INT8/INT4), PagedAttention', slug: 'llm-inference-optimization-kv-cache', description: 'Memory bandwidth bottlenecks in autoregressive decoding, vLLM paging, and AWQ/GPTQ.', estimatedMinutes: 30, difficulty: 'ADVANCED', tags: ['inference', 'kv-cache', 'vllm'] },
        ],
      },
      {
        name: 'Autonomous Agents & AI Safety',
        slug: 'autonomous-agents-safety',
        description: 'Tool calling, multi-agent coordination, prompt injections, and guardrails.',
        concepts: [
          { conceptCode: 'C182', title: 'AI Agents: Tool Calling, Function Calling, Planning & Memory Architectures', slug: 'ai-agents-tool-calling-memory', description: 'JSON schema tool invocation, short-term conversational vs long-term vector memory.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['agents', 'tools'] },
          { conceptCode: 'C183', title: 'Multi-Agent Systems & Orchestration Frameworks (LangChain, LlamaIndex)', slug: 'multi-agent-systems-orchestration', description: 'Supervisor patterns, state machines, reflection, and human-in-the-loop controls.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['langchain', 'multi-agent'] },
          { conceptCode: 'C184', title: 'AI Safety, Alignment, Prompt Injection Attacks & Guardrails', slug: 'ai-safety-prompt-injection-guardrails', description: 'Direct vs indirect prompt injections, jailbreaks, NeMo Guardrails, and defense-in-depth.', estimatedMinutes: 25, difficulty: 'INTERMEDIATE', tags: ['ai-safety', 'guardrails', 'security'] },
        ],
      },
    ],
  },
];
