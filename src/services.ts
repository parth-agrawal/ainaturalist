import { IChatService } from "./interfaces";
import { addMessageStmt, getMessagesStmt } from './db';

import { anthropic } from '@ai-sdk/anthropic';
import { generateText, tool } from 'ai';
import { Computer } from '@hdr/sdk-preview';
import { VersToolDescription } from "./prompts";
import { z } from 'zod';

const makeVersQuery = async (prompt: string) => {
    try {
        console.log('banana', prompt)
        const computer = new Computer();
        // await computer.connect({
        //     wsUrl: 'http://localhost:8080/ws',
        //     mcpUrl: 'http://localhost:8080/mcp'
        // });
        await computer.connect();
        // console.log('apple', computer);
        // // Execute the command
        // const result = await computer.do(prompt);
        // console.log(result);

        // // Close the connection
        await computer.close();

        // return result;
    } catch (error) {
        console.error('Error in makeVersQuery:', error);
        throw error; // Re-throw to handle at higher level
    }
}



export const ChatService = (): IChatService => {
    return {
        respondToChat: async (message: string, phone: string) => {
            const previousMessages = getMessagesStmt.all(phone)
            const messages = previousMessages.map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            }))
            messages.push({ role: 'user', content: message })

            const response = await generateText({
                model: anthropic('claude-3-5-sonnet-latest'),
                messages: messages,
                tools: {
                    vers: tool({
                        description: VersToolDescription,
                        parameters: z.object({
                            prompt: z.string().describe('prompt used to take the Vers action')
                        }),
                        execute: async ({ prompt }) => makeVersQuery(prompt),
                    })
                },
                maxSteps: 5,
                onStepFinish: step => {
                    console.log(JSON.stringify(step, null, 2));
                },
            })

            addMessageStmt.run(phone, 'user', message)
            addMessageStmt.run(phone, 'assistant', response.text)

            return response.text
        },
    }
}

export const ai = ChatService();
export default ai;

