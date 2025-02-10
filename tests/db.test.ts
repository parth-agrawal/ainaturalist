import { expect, test, describe, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Database } from 'bun:sqlite';
import { getMessagesStmt, addMessageStmt } from '../src/db';
import fs from 'fs';

const TEST_DB = 'test.db';

describe('Database Operations', () => {
    let db: Database;
    let getMessagesStmt: ReturnType<Database['prepare']>;
    let addMessageStmt: ReturnType<Database['prepare']>;

    beforeAll(() => {
        // Create test database and tables
        db = new Database(TEST_DB);
        db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        phone TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);

        // Prepare statements for the test database
        getMessagesStmt = db.prepare(
            'SELECT role, content FROM messages WHERE phone = ? ORDER BY created_at'
        );
        addMessageStmt = db.prepare(
            'INSERT INTO messages (phone, role, content) VALUES (?, ?, ?)'
        );
    });

    afterAll(() => {
        // Close database connection before cleanup
        if (db) {
            db.close();
        }
        // Clean up test database
        try {
            fs.unlinkSync(TEST_DB);
        } catch (error) {
            console.error('Error cleaning up test database:', error);
        }
    });

    beforeEach(() => {
        // Clear the messages table before each test
        db.prepare('DELETE FROM messages').run();
    });

    test('should add and retrieve messages for a phone number', () => {
        const testPhone = '+1234567890';
        const testMessage = 'Hello, world!';

        console.log('yolo', testPhone, testMessage)
        // Add a test message
        addMessageStmt.run(
            testPhone,
            'user',
            testMessage
        );

        // Retrieve messages
        const messages = getMessagesStmt.all(testPhone);
        console.log('apple', messages)

        expect(messages).toHaveLength(1);
        expect(messages[0]).toEqual({
            role: 'user',
            content: testMessage
        });
    });

    test('should retrieve messages in correct order', () => {
        const testPhone = '+9876543210';
        const messages = [
            { role: 'user' as const, content: 'First message' },
            { role: 'assistant' as const, content: 'Second message' },
            { role: 'user' as const, content: 'Third message' }
        ];

        // Add multiple messages
        messages.forEach(msg => {
            addMessageStmt.run(testPhone, msg.role, msg.content);
        });

        // Retrieve messages
        const retrievedMessages = getMessagesStmt.all(testPhone);

        expect(retrievedMessages).toHaveLength(messages.length);
        retrievedMessages.forEach((msg, index) => {
            expect(msg).toEqual({
                role: messages[index].role,
                content: messages[index].content
            });
        });
    });

    test('should return empty array for non-existent phone number', () => {
        const nonExistentPhone = '+1111111111';
        const messages = getMessagesStmt.all(nonExistentPhone);

        expect(messages).toBeInstanceOf(Array);
        expect(messages).toHaveLength(0);
    });
}); 