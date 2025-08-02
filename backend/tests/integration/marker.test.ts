import { MongoMemoryServer } from "mongodb-memory-server";
import request from 'supertest';
import mongoose from "mongoose";
import { startServer } from "../../src/server";
import { Marker } from "../../src/models/marker.model";
import { User } from "../../src/models/user.model";

describe('Marker', () => {
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

    describe('POST /api/markers', () => {
        let authCookie: string;

        beforeEach(async () => {
            // Clear the markers collection
            await Marker.deleteMany({});
            // Clear the users collection
            await User.deleteMany({});

            // Create a test user and get authentication cookie
            const registerResponse = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });
            authCookie = registerResponse.headers['set-cookie'][0];
        });

        it('should create a new marker when authenticated', async () => {
            const response = await request(app)
                .post('/api/markers')
                // Using cookie for authentication
                .set('Cookie', authCookie)
                .send({
                    coordinate: {
                        latitude: -33.8688,
                        longitude: 151.2093
                    },
                    title: 'Test Marker'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.title).toBe('Test Marker');
            expect(response.body.coordinate).toEqual({
                latitude: -33.8688,
                longitude: 151.2093
            });
        });

        it('should return 401 when not authenticated', async () => {
            const response = await request(app)
                .post('/api/markers')
                .send({
                    coordinate: {
                        latitude: -33.8688,
                        longitude: 151.2093
                    },
                    title: 'Test Marker'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('msg', 'Unauthorized');
        });

        it('should return 400 when coordinate or title is missing', async () => {
            const response = await request(app)
                .post('/api/markers')
                .set('Cookie', authCookie)
                .send({
                    title: 'Test Marker'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Coordinate and title are required');
        });
    });

    describe('GET /api/markers', () => {
        beforeEach(async () => {
            // Clear the markers collection
            await Marker.deleteMany({});

            // Create some test markers
            await Marker.create([
                {
                    coordinate: { latitude: -33.8688, longitude: 151.2093 },
                    title: 'Marker 1'
                },
                {
                    coordinate: { latitude: -33.8712, longitude: 151.2045 },
                    title: 'Marker 2'
                }
            ]);
        });

        it('should return all markers', async () => {
            const response = await request(app)
                .get('/api/markers');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('title', 'Marker 1');
            expect(response.body[1]).toHaveProperty('title', 'Marker 2');
        });
    });
});