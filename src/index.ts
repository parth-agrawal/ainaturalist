import { Elysia } from "elysia";
import { postChat, twilioWebhook } from "./controller";
import { ChatRequest } from "./types";


const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post('/chat', postChat, ChatRequest)
  .post('/twilio/webhook', twilioWebhook)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
