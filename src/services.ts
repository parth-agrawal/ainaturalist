import { getThreadStmt, insertThreadStmt } from "./db";
import { IAi } from "./interfaces";

export const Ai = (): IAi => {
    return {
        respondToChat: async (message: string) => {

            return "Hello Post Chat"
        },
        makeVersQuery: async (prompt: string) => {
            return "Hello Post Vers Query"
        },
        getOrCreateThreadId: async (phone: string) => {
            const existing = getThreadStmt.get(phone)
            if (existing) return existing.thread_id

            const threadId = crypto.randomUUID()
            insertThreadStmt.run(phone, threadId)
            return threadId
        }
    }
}

