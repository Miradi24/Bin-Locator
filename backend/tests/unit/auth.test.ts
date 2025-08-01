import { Request, Response } from 'express';
import { login, register } from '../../src/controllers/auth.controller';
import { User } from '../../src/models/user.model';
import passport from 'passport';

// Mock the User model to avoid database calls
jest.mock('../../src/models/user.model',);

// Mock passport js
jest.mock('passport', () => ({
    authenticate: jest.fn((strategy, callback) => {
        return (req: Request, res: Response) => {
            callback(null, { _id: '123', email: 'test123@gmail.com' }, null);
        };
    })
}));

describe('Registration', () => {
    it('should register a new user', async () => {
        // Mock the request and response objects
        const req: Partial<Request> = {
            body: {
                email: 'mockemail@gmail.com',
                password: 'mockpassword',
            },
            logIn: jest.fn(),
        };
        const res: Partial<Response> = {};

        // Spy on the User.register method to verify user registration
        const registerSpy = jest.spyOn(User, 'register');

        await register(req as Request, res as Response);
        expect(req.logIn).toHaveBeenCalled();
        expect(registerSpy).toHaveBeenCalled();
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

describe('Login', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should login successfully with valid credentials', () => {
        // Mock the request and response objects
        const req: Partial<Request> = {
            // @ts-ignore
            logIn: jest.fn((user, callback) => callback(null)),
            body: {
                email: 'test123@gmail.com',
                password: 'password123'
            }
        };

        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        login(req as Request, res as Response);

        // Check if passport.authenticate was called with 'local' strategy
        expect(passport.authenticate).toHaveBeenCalledWith('local', expect.any(Function));
        // Check if req.logIn was called and response was sent
        expect(req.logIn).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: '123',
                email: 'test123@gmail.com'
            }
        });
    });

    it('should handle authentication failure', () => {
        // Override passport mock to simulate authentication failure
        (passport.authenticate as jest.Mock).mockImplementationOnce((strategy, callback) => {
            return (req: Request, res: Response) => {
                callback(null, null, { message: 'Invalid credentials' });
            };
        });

        const req: Partial<Request> = {
            body: {
                email: 'test123@gmail.com',
                password: 'wrongpassword'
            }
        };

        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        login(req as Request, res as Response);

        expect(passport.authenticate).toHaveBeenCalledWith('local', expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Invalid credentials',
            error: null
        });
    });

    it('should handle login error', () => {
        const req: Partial<Request> = {
            // @ts-ignore
            logIn: jest.fn((user, callback) => callback(new Error('Login failed'))),
            body: {
                email: 'test123@gmail.com',
                password: 'password123'
            }
        };

        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        login(req as Request, res as Response);

        expect(req.logIn).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Login failed',
            error: 'Login failed'
        });
    });
});