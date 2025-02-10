import { Elysia } from "elysia";
import { postChat } from "./controller";
import { ChatRequest } from "./types";


const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post('/chat', postChat, ChatRequest)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
