import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'gallery.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema(db)
  }
  return db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS albums (
      id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
      slug        TEXT UNIQUE NOT NULL,
      title       TEXT NOT NULL,
      description TEXT,
      date        TEXT NOT NULL,
      cover_url   TEXT,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS photos (
      id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
      album_id      TEXT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
      storage_path  TEXT NOT NULL,
      url           TEXT NOT NULL,
      caption       TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS photos_album_order ON photos(album_id, display_order);
  `)

  // Migrations : ajout des colonnes manquantes
  const cols = db.prepare("PRAGMA table_info(photos)").all() as { name: string }[]
  const colNames = cols.map((c) => c.name)

  if (!colNames.includes('is_favorite')) {
    db.exec('ALTER TABLE photos ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0')
  }
  if (!colNames.includes('thumb_url')) {
    db.exec('ALTER TABLE photos ADD COLUMN thumb_url TEXT')
  }
  if (!colNames.includes('exif_data')) {
    db.exec('ALTER TABLE photos ADD COLUMN exif_data TEXT')
  }
  if (!colNames.includes('location')) {
    db.exec('ALTER TABLE photos ADD COLUMN location TEXT')
  }
  if (!colNames.includes('thumb_width')) {
    db.exec('ALTER TABLE photos ADD COLUMN thumb_width INTEGER')
  }
  if (!colNames.includes('thumb_height')) {
    db.exec('ALTER TABLE photos ADD COLUMN thumb_height INTEGER')
  }
}
