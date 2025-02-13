export interface IChatService {
    respondToChat(message: string, phone: string): Promise<string>;
    register(phone: string): Promise<string>;
}
