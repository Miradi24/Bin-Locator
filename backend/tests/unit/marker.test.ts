import { Request, Response } from 'express';
import { createMarker, getAllMarkers } from '../../src/controllers/marker.controller';

// Mock the Marker model
jest.mock('../../src/models/marker.model');

describe('Marker Controller', () => {

    beforeAll(() => {
        // Spy on console.error, console.log and mock its implementation to prevent actual logging
        jest.spyOn(console, 'error').mockImplementation();
    });

    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createMarker', () => {
        it('should create a new marker when authenticated', async () => {
            const req: Partial<Request> = {
                body: {
                    coordinate: { latitude: 123, longitude: 456 },
                    title: 'Test Marker'
                },
                // @ts-ignore
                isAuthenticated: () => true
            };

            const res: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // @ts-ignore - Mock the Marker model to return a mocked save method
            (Marker as jest.Mock) = jest.fn().mockImplementation(() => ({
                save: jest.fn()
            }));

            await createMarker(req as Request, res as Response);

            // Verify that the marker was created through status code
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 401 when not authenticated', async () => {
            const req: Partial<Request> = {
                body: {
                    coordinate: { latitude: 123, longitude: 456 },
                    title: 'Test Marker'
                },
                // @ts-ignore
                isAuthenticated: () => false
            };

            const res: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createMarker(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ msg: "Unauthorized" });
        });

        it('should return 400 when coordinate or title is missing', async () => {
            const req: Partial<Request> = {
                body: {
                    title: 'Test Marker'
                },
                // @ts-ignore
                isAuthenticated: () => true
            };

            const res: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createMarker(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Coordinate and title are required" });
        });
    });

    describe('getAllMarkers', () => {
        it('should return all markers', async () => {
            const req: Partial<Request> = {};
            const res: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllMarkers(req as Request, res as Response);


            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
        });
    });
});