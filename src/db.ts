import Database from 'better-sqlite3'
const db = new Database('thread.db')

interface ThreadRecord {
    phone: string;
    thread_id: string;
}

db.exec(`
    CREATE TABLE IF NOT EXISTS threads (
      phone TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL
    )
  `)

export const getThreadStmt = db.prepare<[string], ThreadRecord>('SELECT thread_id FROM threads WHERE phone = ?')
export const insertThreadStmt = db.prepare<[string, string], void>('INSERT INTO threads (phone, thread_id) VALUES (?, ?)')