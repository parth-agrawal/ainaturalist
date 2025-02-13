// import { Context, t } from "elysia"


// export type ChatContext = Context<{ body: typeof ChatRequest.body.static }>;

// export const ChatRequest = {
//     body: t.Object({
//         message: t.String(),
//         phone: t.String()
//     })
// }

interface SuccessResponse {
    success: true;
    message: string;
}

interface ErrorResponse {
    success: false;
    error: {
        code: number;
        message: string;
    };
}

export type RegisterResponse = SuccessResponse | ErrorResponse;