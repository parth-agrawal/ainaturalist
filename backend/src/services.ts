import { IChatService, ITwilioService } from "./interfaces";
import { getMessages, addMessage, getPhone, addPhone } from './db';

import { anthropic } from '@ai-sdk/anthropic';
import BetaMessageParam from "@anthropic-ai/sdk"
import { generateText, tool } from 'ai';
import { Computer } from '@hdr/sdk-preview';
import { INaturalistPreprompt, VersToolDescription, VersPreprompt, getVersReasonerPrompt } from "./prompts";
import { z } from 'zod';
import twilioClient from "./twilio";

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const reasonOverVersResponse = async (prompt: string, versResult: BetaMessageParam[]) => {
    const reasonedResponse = await generateText({
        system: getVersReasonerPrompt(prompt, versResult),
        model: anthropic('claude-3-5-sonnet-latest'),
        messages: [{ role: 'user', content: versResult.toLocaleString() }],
    })
    return reasonedResponse;
}

const makeVersQuery = async ({ prompt, phone }: { prompt: string, phone: string }) => {

    const computer = await Computer.create();
    const versResult: BetaMessageParam[] = await computer.do(`${VersPreprompt} ${INaturalistPreprompt} Here is what the user wants you to do: ${prompt}`);
    console.log('apple Vers result:', versResult);
    const reasonedResponse = await reasonOverVersResponse(prompt, versResult.slice(versResult.length - 4, versResult.length - 1));

    await addMessage({ phone, role: 'user', content: reasonedResponse.text })
    await twilioService.send(reasonedResponse.text, phone);
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
                        execute: async ({ prompt }) => {
                            makeVersQuery({ prompt, phone })
                            return 'Got it, checking on that for you...'

                        },
                    })
                },
                onStepFinish: step => {
                    if (step.toolCalls.length > 0) {
                        console.log('Tool call detected');
                    }
                    console.log(JSON.stringify(step, null, 2));
                },
            })

            if (!response.text) {
                throw new Error('Empty text in response from Claude:' + response);
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

export const TwilioService = (): ITwilioService => {
    return {
        send: async (body: string, to: string) => {
            try {
                await twilioClient.messages.create({
                    body: body,
                    to: to,
                    from: process.env.TWILIO_PHONE_NUMBER
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }

}

export const chatService = ChatService();
export const twilioService = TwilioService();

