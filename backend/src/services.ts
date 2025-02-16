import { IChatService } from "./interfaces";
import { getMessages, addMessage, getPhone, addPhone } from './db';

import { anthropic } from '@ai-sdk/anthropic';
import { generateText, tool } from 'ai';
import { Computer } from '@hdr/sdk-preview';
import { INaturalistPreprompt, VersToolDescription, VersPreprompt } from "./prompts";
import { z } from 'zod';
import twilioClient from "./twilio";

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const makeVersQuery = async (prompt: string) => {
    // let computer;
    // try {
    //     computer = await Computer.create();
    // } catch (error) {
    //     console.error('Failed to create computer:', error);
    //     throw error;
    // }
    const computer = await Computer.create();
    const result = await computer.do(`${VersPreprompt} ${INaturalistPreprompt} Here is what the user wants you to do: ${prompt}`);
    // const result = await computer.do('Curl google.com');

    return result;
}


export const ChatService = (): IChatService => {
    return {
        respondToChat: async (message: string, phone: string) => {
            console.log('Responding to chat');

            if (!message || !phone) {
                throw new Error('Message and phone are required');
            }


            const previousMessages = await getMessages({ phone })
            const messages = previousMessages.map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            }))
            messages.push({ role: 'user', content: message })
            console.log('Messages:', messages);

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

            if (!response.text) {
                console.log('Claude response:', response);
                throw new Error('Empty response from Claude');
            }


            await addMessage({ phone, role: 'user', content: message })
            await addMessage({ phone, role: 'assistant', content: response.text })

            return response.text



        },
        register: async (phone: string) => {
            const phoneEntry = await getPhone(phone)
            if (phoneEntry) {
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: 'Phone already registered.'
                    }
                }
            }

            try {
                await addPhone(phone)
                const response = await twilioClient.messages.create({
                    body: 'Welcome to AI Naturalist! Reply YES to get nature identification messages. Msg&data rates apply. Reply STOP anytime',
                    to: phone,
                    from: process.env.TWILIO_PHONE_NUMBER
                });
                return {
                    success: true,
                    message: 'Phone registered successfully. You should receive a text shortly.'
                };
            } catch (error) {
                console.error('Error sending welcome message:', error);
                return {
                    success: false,
                    error: {
                        code: 400,
                        message: 'Phone registered but there was an error sending the welcome message. Please try again later.'
                    }
                };
            }
        }
    }
}

export const chatService = ChatService();
export default chatService;

