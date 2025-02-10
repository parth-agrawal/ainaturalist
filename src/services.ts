import { IAi } from "./interfaces";

export const Ai = (): IAi => {
    return {
        respondToChat: async (message: string) => {
            return "Hello Post Chat"
        },
        makeVersQuery: async (prompt: string) => {
            return "Hello Post Vers Query"
        }
    }
}