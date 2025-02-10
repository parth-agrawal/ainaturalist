import { Context } from "elysia";
import ai from "./services";
import { ChatContext } from "./types";

export const postChat = async ({ body }: ChatContext) => {
    const response = await ai.respondToChat(body.message, body.phone);
    return response;
}

interface TwilioRequestBody {
    Body: string;
    From: string;
}

export const twilioWebhook = async (c: Context & { body: TwilioRequestBody }) => {
    const { Body: message, From: phone } = c.body;
    const response = await ai.respondToChat(message, phone);


    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${response}</Message></Response>`,
        { headers: { 'Content-Type': 'application/xml' } }
    )
}