import { Router, Request, Response } from "express";
import { getDb } from "../db";
import type { EventType } from "../types/db";

const router = Router();

const VALID_EVENT_TYPES: EventType[] = ["view", "click", "add_to_cart"];

interface CreateEventBody {
  videoId: number;
  eventType: EventType;
}

// Mirrors the digit-only check used for pagination params in analytics.ts —
// rejects non-integers, negatives, and numeric strings, not just wrong types.
function parseVideoId(value: unknown): number | null {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0)
    return value;
  return null;
}

function validateBody(
  body: unknown,
): { data: CreateEventBody } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be a JSON object." };
  }

  const { videoId, eventType } = body as Record<string, unknown>;

  const parsedVideoId = parseVideoId(videoId);
  if (parsedVideoId === null) {
    return { error: '"videoId" must be a positive integer.' };
  }

  if (
    typeof eventType !== "string" ||
    !VALID_EVENT_TYPES.includes(eventType as EventType)
  ) {
    return {
      error: `"eventType" must be one of: ${VALID_EVENT_TYPES.join(", ")}.`,
    };
  }

  return {
    data: { videoId: parsedVideoId, eventType: eventType as EventType },
  };
}

router.post("/", (req: Request, res: Response) => {
  const validated = validateBody(req.body);
  if ("error" in validated) {
    return res.status(400).json({ error: validated.error });
  }
  const { videoId, eventType } = validated.data;

  try {
    const db = getDb();

    const video = db.prepare("SELECT id FROM videos WHERE id = ?").get(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ error: `Video with id ${videoId} does not exist.` });
    }

    const result = db
      .prepare(
        "INSERT INTO engagement_events (video_id, event_type) VALUES (?, ?)",
      )
      .run(videoId, eventType);

    const created = db
      .prepare(
        "SELECT id, video_id AS videoId, event_type AS eventType, timestamp FROM engagement_events WHERE id = ?",
      )
      .get(result.lastInsertRowid);

    res.status(201).json(created);
  } catch (err) {
    console.error("Failed to create engagement event:", err);
    res.status(500).json({ error: "Failed to create engagement event." });
  }
});

export default router;
