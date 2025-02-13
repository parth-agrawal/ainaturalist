import { Request, Response } from 'express';
import chatService from "./services";

interface ChatRequestBody {
    message: string;
    phone: string;
}

export const postChat = async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
    try {
        const response = await chatService.respondToChat(req.body.message, req.body.phone);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const postRegister = async (req: Request, res: Response) => {
    try {
        const { phone } = req.body;
        const response = await chatService.register(phone);
        res.json({ response })

    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

interface TwilioRequestBody {
    Body: string;
    From: string;
}

export const twilioWebhook = async (req: Request<{}, {}, TwilioRequestBody>, res: Response) => {
    try {
        const { Body: message, From: phone } = req.body;
        const response = await chatService.respondToChat(message, phone);

        res.set('Content-Type', 'application/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${response}</Message></Response>`);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}