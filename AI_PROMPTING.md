# AI Prompting Log

## 1. Initial Assignment Analysis

### Tool Used

Claude Sonnet 5 (chat)

### Context

Analyze the take-home assignment and help plan the project before implementation.

### Exact Prompt Used

> Read & analyse the attached assignment carefully. Act as a senior full-stack engineer helping me plan this project. Don't write code yet.
>
> Give me:
>
> 1. A concise breakdown of exactly what needs to be built.
> 2. The recommended tech stack and project structure.
> 3. A practical implementation order for 6 hrs timeline.
>
> Keep the solution simple and production-quality; don't overengineer it. Also flag anything in the assignment that is ambiguous.

### Outcome & Adjustments

The AI provided an initial project breakdown, suggested a practical stack and structure, and identified implementation stages and ambiguities. I adjusted frontend structure slightly.



## 2. Backend & Database Foundation

### Tool Used

Claude Sonnet 5 (chat)

### Context

Start backend implementation using the existing project structure, focusing only on SQLite setup, required database schema, and seed data.

### Exact Prompt Used

> Let's start with backend. Use the existing project structure. Don't unnecessarily recreate or change the existing setup. Keep code organized and easy to understand. Implement:

> 1. SQLite database setup using better-sqlite3.
> 2. Products, Videos and EngagementEvents tables; appropriate primary keys, foreign keys, constraints and timestamps according to requirements (refer assignment doc).
> 3. A simple seed script with realistic products, videos and engagement events. One video with no engagement events.

> Don't implement the API endpoints or frontend yet.

### Outcome & Adjustments

The AI implemented the SQLite connection, required schema, and seed data. I reviewed the generated database design and simplified it by removing the unnecessary migration layer and keeping schema initialization within the seed script.