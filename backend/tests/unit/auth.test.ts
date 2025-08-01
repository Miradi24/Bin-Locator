import { Request, Response } from 'express';
import { login, register } from '../../src/controllers/auth.controller';

// Mock the User model to avoid database calls
jest.mock('../../src/models/user.model');

describe('Registration', () => {
    it('should register a new user', async () => {
        const req: Partial<Request> = {
            body: {
                email: 'mockemail@gmail.com',
                password: 'mockpassword',
            },
            logIn: jest.fn(),
        };
        const res: Partial<Response> = {};

        await register(req as Request, res as Response);

        expect(req.logIn).toHaveBeenCalled();
    });

    it('should return 400 code if email or password is missing', async () => {
        const req: Partial<Request> = {
            body: {
                email: '',
                password: '',
            },
        };
        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await register(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Email and password are required' });
    });
});