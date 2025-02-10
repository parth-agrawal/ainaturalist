export interface IAi {
    respondToChat(message: string): Promise<string>;
    makeVersQuery(prompt: string): Promise<string>;
}