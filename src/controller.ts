import { ChatContext } from "./types";

export const postChat = async ({ body }: ChatContext) => {
    console.log(body.message)
    return "Hello Post Chat"
}