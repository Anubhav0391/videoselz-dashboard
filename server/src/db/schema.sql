-- Videoselz Analytics Dashboard schema
-- One product -> many videos -> many engagement events.

CREATE TABLE IF NOT EXISTS products (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  price      REAL NOT NULL CHECK (price >= 0),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS videos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  video_url  TEXT NOT NULL,
  title      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS engagement_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id   INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'add_to_cart')),
  timestamp  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Aggregation query (GET /api/analytics/videos) filters/groups by video_id
-- and will often filter by event_type too, so both are indexed.
CREATE INDEX IF NOT EXISTS idx_events_video_id ON engagement_events(video_id);
CREATE INDEX IF NOT EXISTS idx_videos_product_id ON videos(product_id);