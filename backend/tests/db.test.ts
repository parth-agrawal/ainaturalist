import { expect, test, describe, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Pool } from 'pg';
import { getMessages, addMessage } from '../../src/db';

describe('Database Operations', () => {
    let pool: Pool;

    beforeAll(async () => {
        // First connect to default postgres database
        const setupPool = new Pool({
            connectionString: 'postgresql://postgres:postgres@host.docker.internal:5600/postgres'
        });

        try {
            // Check if test_db exists
            const dbResult = await setupPool.query(
                "SELECT 1 FROM pg_database WHERE datname = 'test_db'"
            );

            // Create test_db if it doesn't exist
            if (dbResult.rows.length === 0) {
                await setupPool.query('CREATE DATABASE test_db');
            }
        } finally {
            await setupPool.end();
        }

        // Now connect to test database
        process.env.DATABASE_URL = 'postgresql://postgres:postgres@host.docker.internal:5600/test_db';
        pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });

        // Create test table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                phone TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
                content TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
    });

    afterAll(async () => {
        // Drop test table and close connection
        await pool.query('DROP TABLE IF EXISTS messages');
        await pool.end();
    });

    beforeEach(async () => {
        // Clear the messages table before each test
        await pool.query('DELETE FROM messages');
    });

    test('should add and retrieve messages for a phone number', async () => {
        const testPhone = '+1234567890';
        const testMessage = 'Hello, world!';

        // Add a test message
        await addMessage({
            phone: testPhone,
            role: 'user',
            content: testMessage
        });

        // Retrieve messages
        const messages = await getMessages({ phone: testPhone });

        expect(messages).toHaveLength(1);
        expect(messages[0]).toEqual({
            role: 'user',
            content: testMessage
        });
    });

    test('should retrieve messages in correct order', async () => {
        const testPhone = '+9876543210';
        const messages = [
            { role: 'user' as const, content: 'First message' },
            { role: 'assistant' as const, content: 'Second message' },
            { role: 'user' as const, content: 'Third message' }
        ];

        // Add multiple messages
        for (const msg of messages) {
            await addMessage({
                phone: testPhone,
                role: msg.role,
                content: msg.content
            });
        }

        // Retrieve messages
        const retrievedMessages = await getMessages({ phone: testPhone });

        expect(retrievedMessages).toHaveLength(messages.length);
        retrievedMessages.forEach((msg, index) => {
            expect(msg).toEqual({
                role: messages[index].role,
                content: messages[index].content
            });
        });
    });

    test('should return empty array for non-existent phone number', async () => {
        const nonExistentPhone = '+1111111111';
        const messages = await getMessages({ phone: nonExistentPhone });

        expect(messages).toBeInstanceOf(Array);
        expect(messages).toHaveLength(0);
    });
}); 