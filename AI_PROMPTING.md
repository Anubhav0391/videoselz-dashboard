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

The AI implemented the paginated video analytics endpoint with conditional aggregation, a LEFT JOIN to include videos with zero events, pagination metadata, query-parameter validation, parameterized SQL, and basic error handling. No major adjustments were made at this point.



## 4. Backend — Engagement Events API

### Tool Used

Claude Sonnet 5 (chat)

### Context

Continue backend implementation by adding the event ingestion endpoint using the existing SQLite setup. Focus on request validation, video existence, secure database operations, and error handling.

### Exact Prompt Used

> Continue with the existing backend implementation. Don't change or recreate the existing setup unless required.
>
> Now implement only the `POST /api/events` endpoint:
>
> 1. Accept `videoId` and `eventType`, validate request body
> 2. Check that the referenced video exists and return appropriate errors.
> 3. Use parameterized SQL queries.
> 4. Handle invalid requests and database/server errors with appropriate responses.
>
> Follow the existing project structure and coding style. Avoid overengineering.

### Outcome & Adjustments

The AI implemented the `POST /api/events` endpoint with request validation, video existence checking, parameterized SQL, server/database-generated timestamps, and appropriate error handling. Minor fixes were made during review.



## 5. Frontend — Analytics Dashboard

### Tool Used

Claude Sonnet 5 (chat) + ChatGPT

### Context

Implement the initial frontend dashboard using the existing Vite + TypeScript setup, focusing on analytics API integration, table display, pagination, and basic UI states. A reference screenshot was provided for the page layout.

### Exact Prompt Used

> Let's implement frontend. Don't recreate or unnecessarily change the existing setup.
>
> 1. Set up the API client and types for `GET /api/analytics/videos`.
> 2. Fetch and display video analytics in a table.
> 3. Calculate conversion rate on the frontend as `addToCarts / views`, handling zero views appropriately.
> 4. Implement pagination using the pagination data returned by the API.
> 5. Handle loading, error, and no-data states.
> 6. Keep the page minimal with - navbar, page title, short description/subtitle analytics table, pagination
> 7. Use semantic HTML and basic accessibility practices.
> 8. Keep the implementation simple and avoid unnecessary state-management libraries, UI libraries, or abstractions.
>
> Don't implement the Simulate Traffic functionality or detailed styling yet. Follow layout from screenshot.

### Outcome & Adjustments

The AI implemented the analytics API integration, TypeScript types, video analytics table, frontend conversion-rate calculation, pagination, and loading/error/no-data states. The page structure was kept minimal and aligned with the provided reference layout. I modified logic under `useVideoAnalytics.ts` for better readability and optimistic updates.



## 6. Frontend — Simulate Traffic & UI Improvements

### Tool Used

Claude Sonnet 5 (chat)

### Context

Continue the existing frontend implementation by adding the Simulate Traffic interaction and completing the dashboard UI using the provided reference screenshot. Focus on keeping the implementation simple, responsive, accessible, and consistent with the existing architecture.

### Exact Prompt Used

> Continue with the existing frontend implementation. Don't recreate or unnecessarily change the existing setup.
>
> Now implement the remaining frontend functionality and UI improvements:
>
> 1. Implement "Simulate Traffic" using `POST /api/events`.
>
>    * Send a random valid event for an available video.
>    * Use the successful POST response to update the affected row locally instead of unnecessarily refetching all analytics.
>    * Handle loading and error states appropriately.
> 2. Improve the UI using the shared screenshot as the visual reference.
>
>    * Follow its color theme, spacing, typography, and overall visual style.
>    * Keep all table rows consistent; don't alternate row background colors.
>    * Use appropriate `react-icons` where they improve clarity, without overusing icons.
>    * Add suitable icons to error and no-data states.
> 3. Handle text overflow:
>
>    * Don't allow text to wrap.
>    * Truncate overflowing text with an ellipsis.
>    * Show the full value in a tooltip when text is truncated.
> 4. Make the dashboard responsive.
>
>    * Adjust outer page padding at smaller widths.
>    * Allow the table container to use the available width.
>    * If the table becomes wider than the viewport, allow horizontal scrolling rather than breaking the layout.
>    * Follow the responsive layout shown in the reference image; ignore its hamburger menu.
>
> Keep the implementation simple, accessible, and consistent with the existing architecture. Don't introduce unnecessary libraries or abstractions.

### Outcome & Adjustments

The AI implemented the required functionality and UI improvements. I modified the overall layout and styling to improve spacing, visual hierarchy, responsiveness, and consistency.

