import { MongoMemoryServer } from "mongodb-memory-server";
import request from 'supertest';
import mongoose from "mongoose";
import { startServer } from "../../src/server";

describe('Authentication', () => {
    let mongoServer: MongoMemoryServer;
    let app: any;

    beforeAll(async () => {
        // Start an in memory MongoDB server for testing
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        app = await startServer(true);
    });

    afterAll(async () => {
        // Close the Mongoose connection and stop the in-memory server
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('Register', () => {
        it('/auth/register - should register a new user', async () => {
            // Send a POST request to the register endpoint
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'testuser@gmail.com',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user).toHaveProperty('email', 'testuser@gmail.com');
        });

        it('/auth/register - should not register a new user with existing email', async () => {
            // Becuase on the previous test, this email should already exist we send the same email
            // So expect a 409 error
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'testuser@gmail.com',
                    password: 'password123'
                });

            expect(response.status).toBe(409);
            expect(response.body).toMatchObject(expect.objectContaining({
                msg: 'Email already exists'
            }));
        });
    });

    describe('Login', () => {
        beforeAll(async () => {
            // Register a new user before testing login
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'testuser@gmail.com',
                    password: 'password123'
                });
        });

        it('/auth/login - should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@gmail.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user).toHaveProperty('email', 'testuser@gmail.com');
        });

        it('/auth/login - should not login with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'invaliduser@gmail.com',
                    password: 'password123'
                });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('msg', 'Password or username is incorrect');

        });
    });
});