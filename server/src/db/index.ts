import path from 'path';
import Database from 'better-sqlite3';
import fs from 'fs';

// Single shared connection for the whole process. better-sqlite3 is
// synchronous, so there's no pooling to worry about for a project this size.
export const DB_PATH: string =
  process.env.DB_PATH || path.join(__dirname, '../../data/videoselz.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

let db: Database.Database | undefined;

export function getDb(): Database.Database {
  if (db) return db;

  db = new Database(DB_PATH);

  // SQLite doesn't enforce foreign keys unless you turn it on per-connection.
  // Without this, deleting a product would silently leave orphaned videos/events.
  db.pragma('foreign_keys = ON');

  // WAL mode lets the "simulate traffic" write (POST /api/events) run without
  // blocking a concurrent analytics read.
  db.pragma('journal_mode = WAL');

  return db;
}