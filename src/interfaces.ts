export interface IAi {
    respondToChat(message: string, phone: string): Promise<string>;
    makeVersQuery(prompt: string): Promise<string>;
}
