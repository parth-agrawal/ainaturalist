import { Context, t } from "elysia"


export type ChatContext = Context<{ body: typeof ChatRequest.body.static }>;

export const ChatRequest = {
    body: t.Object({
        message: t.String()
    })
}