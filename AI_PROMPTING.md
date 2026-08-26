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



## 3. Backend — Video Analytics API

### Tool Used

Claude Sonnet 5 (chat) + ChatGPT

### Context

Continue backend implementation by adding only the video analytics endpoint using the existing SQLite setup. Focus on aggregation, pagination, validation, SQL security, and error handling.

### Exact Prompt Used

> Continue with the existing backend implementation. Don't change or recreate the existing setup unless required.

> Now implement only the `GET /api/analytics/videos`:

> 1. Fetch aggregated analytics for videos, including - video id, video title, product name, views, clicks, add to cart count
> 2. Make sure videos with zero engagement events are still returned with 0 counts.
> 3. Add basic pagination using page and limit query params and return the pagination metadata.
> 4. Validate pagination parameters appropriately.
> 5. Use parameterized SQL queries and avoid SQL injection.
> 6. Handle errors gracefully with appropriate responses.

> Follow the existing project structure and coding style, avoid overengineering. Don't implement POST /api/events or make any frontend changes yet.

### Outcome & Adjustments

The AI implemented the paginated video analytics endpoint with conditional aggregation, a LEFT JOIN to include videos with zero events, pagination metadata, query-parameter validation, parameterized SQL, and basic error handling. No major adjustment were made at this point.