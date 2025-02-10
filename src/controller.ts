import ai from "./services";
import { ChatContext } from "./types";

export const postChat = async ({ body }: ChatContext) => {
    const response = await ai.respondToChat(body.message, body.phone);
    return response;
}