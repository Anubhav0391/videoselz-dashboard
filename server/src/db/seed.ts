import fs from 'fs';
import path from 'path';
import { getDb, DB_PATH } from './index';
import type { EventType } from '../types/db';

interface SeedProduct {
  name: string;
  price: number;
}

interface SeedVideo {
  productIndex: number;
  title: string;
  videoUrl: string;
  /** Fixed total engagement events for this video. 0 = the zero-events test case. */
  eventCount: number;
}

// Realistic-ish e-commerce catalog. Deliberately small — enough variety to
// exercise pagination and aggregation, not so much it's slow to read through.
const PRODUCTS: SeedProduct[] = [
  { name: 'Classic Leather Sneakers', price: 89.99 },
  { name: 'Wireless Noise-Cancelling Headphones', price: 249.0 },
  { name: 'Stainless Steel Pour-Over Kettle', price: 45.5 },
  { name: 'Organic Cotton Crewneck Sweater', price: 64.0 },
  { name: 'Ceramic Plant Pot Set (3-Piece)', price: 32.99 },
];

// 13 videos across the 5 products — enough for pagination with limit=10 to
// produce a real page 2 (13 total → page 1 has 10, page 2 has 3).
// eventCount is fixed per video (no randomness) so re-seeding always produces
// the exact same numbers, which makes writing/checking analytics assertions
// straightforward. The last video is the deliberate zero-events case.
const VIDEOS: SeedVideo[] = [
  { productIndex: 0, title: 'Sneaker unboxing & first look', videoUrl: 'https://cdn.videoselz.com/v/sneaker-unboxing.mp4', eventCount: 42 },
  { productIndex: 0, title: 'How they fit true-to-size', videoUrl: 'https://cdn.videoselz.com/v/sneaker-fit-guide.mp4', eventCount: 58 },
  { productIndex: 0, title: 'Sneaker care & cleaning tips', videoUrl: 'https://cdn.videoselz.com/v/sneaker-care-tips.mp4', eventCount: 21 },
  { productIndex: 1, title: 'Noise cancellation put to the test', videoUrl: 'https://cdn.videoselz.com/v/headphones-anc-test.mp4', eventCount: 67 },
  { productIndex: 1, title: 'Unboxing & first impressions', videoUrl: 'https://cdn.videoselz.com/v/headphones-unboxing.mp4', eventCount: 35 },
  { productIndex: 2, title: 'Perfect pour-over technique', videoUrl: 'https://cdn.videoselz.com/v/kettle-pour-technique.mp4', eventCount: 29 },
  { productIndex: 2, title: 'Kettle vs. drip: a comparison', videoUrl: 'https://cdn.videoselz.com/v/kettle-vs-drip.mp4', eventCount: 48 },
  { productIndex: 3, title: 'Sweater styled 3 ways', videoUrl: 'https://cdn.videoselz.com/v/sweater-styling.mp4', eventCount: 71 },
  { productIndex: 3, title: 'Fabric close-up & fit guide', videoUrl: 'https://cdn.videoselz.com/v/sweater-fit-guide.mp4', eventCount: 18 },
  { productIndex: 3, title: 'Washing & care instructions', videoUrl: 'https://cdn.videoselz.com/v/sweater-care.mp4', eventCount: 26 },
  { productIndex: 4, title: 'Unboxing the plant pot set', videoUrl: 'https://cdn.videoselz.com/v/pot-set-unboxing.mp4', eventCount: 39 },
  { productIndex: 4, title: 'Repotting a succulent, step by step', videoUrl: 'https://cdn.videoselz.com/v/pot-set-repotting.mp4', eventCount: 53 },
  { productIndex: 2, title: 'Kettle in action (just posted)', videoUrl: 'https://cdn.videoselz.com/v/kettle-just-posted.mp4', eventCount: 0 }, // zero events
];

// Roughly realistic funnel: most engagement is views, fewer clicks,
// fewer still add-to-carts.
const EVENT_WEIGHTS: Record<EventType, number> = { view: 0.7, click: 0.22, add_to_cart: 0.08 };

// Splits a fixed total into view/click/add_to_cart counts using the weights
// above. Deterministic (no Math.random) — same total always yields the same
// split, with any rounding remainder absorbed into "view" since that's the
// largest bucket and the least sensitive to a +/-1 nudge.
function weightedSplit(total: number): { type: EventType; count: number }[] {
  const clicks = Math.round(total * EVENT_WEIGHTS.click);
  const addToCarts = Math.round(total * EVENT_WEIGHTS.add_to_cart);
  const views = total - clicks - addToCarts;
  return [
    { type: 'view', count: views },
    { type: 'click', count: clicks },
    { type: 'add_to_cart', count: addToCarts },
  ];
}

// Deterministic timestamp for the n-th event of a video: spread one hour
// apart, counting backward from a fixed anchor date. No Date.now()/Math.random()
// involved, so the seeded data (and its timestamps) are identical on every run.
const ANCHOR_DATE = new Date('2026-08-20T12:00:00Z');
function timestampFor(videoIndex: number, eventIndex: number): string {
  const hoursAgo = videoIndex * 3 + eventIndex; // spreads events out, avoids collisions
  const ts = new Date(ANCHOR_DATE.getTime() - hoursAgo * 60 * 60 * 1000);
  return ts.toISOString().slice(0, 19).replace('T', ' ');
}

export function seed(): void {
  // getDb() doesn't create the containing folder — on a fresh clone with no
  // data/ directory yet, opening the DB file would fail before we even get
  // to the schema. This used to be handled by migrate.ts; now that seed.ts
  // owns schema setup itself, it needs to do this step too.
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  const db = getDb();

  // Seed script owns schema setup directly — no dependency on migrate.ts.
  // CREATE TABLE/INDEX IF NOT EXISTS in schema.sql makes this safe to run
  // every time, whether the DB file is fresh or already exists.
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);

  const insertProduct = db.prepare<[string, number]>('INSERT INTO products (name, price) VALUES (?, ?)');
  const insertVideo = db.prepare<[number, string, string]>(
    'INSERT INTO videos (product_id, video_url, title) VALUES (?, ?, ?)'
  );
  const insertEvent = db.prepare<[number, EventType, string]>(
    'INSERT INTO engagement_events (video_id, event_type, timestamp) VALUES (?, ?, ?)'
  );

  const seedAll = db.transaction(() => {
    db.exec('DELETE FROM engagement_events');
    db.exec('DELETE FROM videos');
    db.exec('DELETE FROM products');

    const productIds: number[] = PRODUCTS.map(
      (p) => insertProduct.run(p.name, p.price).lastInsertRowid as number
    );

    const videoIds: number[] = VIDEOS.map(
      (v) => insertVideo.run(productIds[v.productIndex], v.videoUrl, v.title).lastInsertRowid as number
    );

    VIDEOS.forEach((video, videoIndex) => {
      const videoId = videoIds[videoIndex];
      const split = weightedSplit(video.eventCount);

      let eventIndex = 0;
      for (const { type, count } of split) {
        for (let i = 0; i < count; i++) {
          insertEvent.run(videoId, type, timestampFor(videoIndex, eventIndex));
          eventIndex++;
        }
      }
    });
  });

  seedAll();

  const counts = {
    products: (db.prepare('SELECT COUNT(*) AS c FROM products').get() as { c: number }).c,
    videos: (db.prepare('SELECT COUNT(*) AS c FROM videos').get() as { c: number }).c,
    events: (db.prepare('SELECT COUNT(*) AS c FROM engagement_events').get() as { c: number }).c,
  };
  console.log('Seeded:', counts);
  const zeroEventVideo = VIDEOS.find((v) => v.eventCount === 0);
  console.log(`Video "${zeroEventVideo?.title}" was left with zero events on purpose.`);
}

if (require.main === module) {
  seed();
}