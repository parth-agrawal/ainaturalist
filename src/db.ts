import { Database } from 'bun:sqlite'

const db = new Database('thread.db')

interface Message {
  role: 'user' | 'assistant';
  content: string;
  [key: string]: string;
}

interface AddMessageParams {
  phone: string;
  role: 'user' | 'assistant';
  content: string;
  [key: string]: string | 'user' | 'assistant';
}

interface GetMessagesParams {
  phone: string;
}


db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`)

export const getMessagesStmt = db.prepare<Message, string>(
  'SELECT role, content FROM messages WHERE phone = :phone ORDER BY created_at'
)
export const addMessageStmt = db.prepare<void, [string, 'user' | 'assistant', string]>(
  'INSERT INTO messages (phone, role, content) VALUES (:phone, :role, :content)'
)
