import { IAi } from "./interfaces";
import { addMessageStmt, getMessagesStmt } from './db';

import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';






export const Ai = (): IAi => {

    return {

        respondToChat: async (message: string, phone: string) => {

            const previousMessages = getMessagesStmt.all(phone)
            const messages = previousMessages.map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            }))
            messages.push({ role: 'user', content: message })

            const response = await generateText({
                model: anthropic('claude-3-haiku-20240307'),
                messages: messages
            });

            addMessageStmt.run(phone, 'user', message)
            addMessageStmt.run(phone, 'assistant', response.text)

            return response.text
        },
        makeVersQuery: async (prompt) => {
            return "Hello Post Vers Query"
        }
    }
}

export const ai = Ai();
export default ai;

// const getThreadsFromAnthropic = async (threadId: string,) => {
//     return await 


// }

