import { describe, expect, test } from "bun:test";
import ai from "../src/services";

describe('AI Operations', () => {
    test('should respond to a chat message', async () => {
        // TODO: Implement test
        await ai.respondToChat('Tell me about yourself!', '+1234567890');

    })

})