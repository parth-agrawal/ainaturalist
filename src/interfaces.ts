export interface IChatService {
    respondToChat(message: string, phone: string): Promise<string>;
    makeVersQuery(prompt: string): Promise<string>;
}
