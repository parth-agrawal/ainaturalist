import Anthropic from '@anthropic-ai/sdk'
import { IAi } from "./interfaces";
import { addMessageStmt, getMessagesStmt } from './db';

export const Ai = (): IAi => {
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    })

    return {

        respondToChat: async (message: string, phone: string) => {
            // Get previous messages
            const previousMessages = getMessagesStmt.all(phone)
            const messages = previousMessages.map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            }))
            messages.push({ role: 'user', content: message })

            // Get response from Claude
            const response = await anthropic.messages.create({
                model: "claude-3-opus-20240229",
                max_tokens: 1024,
                messages: messages
            })

            // Store both messages
            addMessageStmt.run(phone, 'user', message)
            const assistantMessage = response.content[0]
            console.log('assistantMessage', assistantMessage)
            addMessageStmt.run(phone, 'assistant', assistantMessage)

            return assistantMessage
        },
        makeVersQuery: async (prompt) => {
            return "Hello Post Vers Query"
        }
    }
}

export default Ai;

// const getThreadsFromAnthropic = async (threadId: string,) => {
//     return await 


// }

