import { Router, Request, Response } from "express";
import { getDb } from "../db";

const router = Router();

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 100;

interface AnalyticsVideoRow {
  videoId: number;
  title: string;
  productName: string;
  views: number;
  clicks: number;
  addToCarts: number;
}

interface PaginationParams {
  page: number;
  limit: number;
}

// Parses a single query param as a positive integer. Returns:
// - a number, if the value is a valid positive integer
// - undefined, if the param was omitted (caller applies the default)
// - null, if the param was present but invalid (caller returns 400)
function parsePositiveIntParam(value: unknown): number | undefined | null {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.trim() === "") return null;

  // Reject anything that isn't purely digits (no "1.5", "-1", "1e3", "abc").
  if (!/^\d+$/.test(value)) return null;

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return null;

  return parsed;
}

function parsePagination(
  query: Request["query"],
): PaginationParams | { error: string } {
  const page = parsePositiveIntParam(query.page);
  if (page === null) {
    return { error: '"page" must be a positive integer (e.g. ?page=1).' };
  }

  const limit = parsePositiveIntParam(query.limit);
  if (limit === null) {
    return { error: '"limit" must be a positive integer (e.g. ?limit=10).' };
  }
  if (limit !== undefined && limit > MAX_LIMIT) {
    return { error: `"limit" cannot exceed ${MAX_LIMIT}.` };
  }

  return {
    page: page ?? DEFAULT_PAGE,
    limit: limit ?? DEFAULT_LIMIT,
  };
}

router.get("/videos", (req: Request, res: Response) => {
  const parsed = parsePagination(req.query);
  if ("error" in parsed) return res.status(400).json({ error: parsed.error });

  const { page, limit } = parsed;
  const offset = (page - 1) * limit;

  try {
    const db = getDb();

    const { total } = db
      .prepare("SELECT COUNT(*) AS total FROM videos")
      .get() as { total: number };

    // Start from videos (not engagement_events) with a LEFT JOIN, so a video
    // with zero events still appears in the result with 0/0/0 counts instead
    // of being dropped. One pass, conditional aggregation — no per-row
    // subqueries and no cartesian product from the join.
    const rows = db
      .prepare(
        `
        SELECT
          v.id AS videoId,
          v.title AS title,
          p.name AS productName,
          COUNT(CASE WHEN e.event_type = 'view' THEN 1 END) AS views,
          COUNT(CASE WHEN e.event_type = 'click' THEN 1 END) AS clicks,
          COUNT(CASE WHEN e.event_type = 'add_to_cart' THEN 1 END) AS addToCarts
        FROM videos v
        JOIN products p ON p.id = v.product_id
        LEFT JOIN engagement_events e ON e.video_id = v.id
        GROUP BY v.id, v.title, p.name
        ORDER BY v.id
        LIMIT ? OFFSET ?
        `,
      )
      .all(limit, offset) as AnalyticsVideoRow[];

    res.json({
      data: rows,
      pagination: { page, limit, total },
    });
  } catch (err) {
    console.error("Failed to fetch video analytics:", err);
    res.status(500).json({ error: "Failed to fetch video analytics." });
  }
});

export default router;
