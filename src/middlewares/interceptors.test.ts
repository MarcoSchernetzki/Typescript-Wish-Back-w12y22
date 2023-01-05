import { NextFunction, Request, Response } from 'express';
import { ExtraRequest, logged, who } from './interceptors';

describe('Given the logged interceptor', () => {
    describe('When its invoked', () => {
        test('When the authString is empty, it should return an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce(false),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });

    test('Then if the readToken function reads the token and its not valid, then it should return an error', () => {
        const req: Partial<Request> = {
            get: jest.fn().mockReturnValueOnce('Bearer token'),
        };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();

        logged(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    test('Then if the readToken inside the logged interceptor function reads a correct token, it should return the payload', () => {
        const req: Partial<ExtraRequest> = {
            get: jest
                .fn()
                .mockReturnValueOnce(
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODhjOTk5N2U5M2EwM2Q4NGMwMzJjOSIsIm5hbWUiOiJlbGVuYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjY5OTk5NzI5fQ.5kAFeWb1g9wycyzlJZTKO7f_GvNMCa7rz1VZpFuBeI0'
                ),
        };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();

        logged(req as ExtraRequest, res as Response, next);
        expect(next).toHaveBeenCalled();

        expect(req.payload).toStrictEqual({
            id: expect.any(String),
            iat: expect.any(Number),
            name: 'elena',
            role: 'user',
        });
    });
});

describe('Given the who interceptor', () => {
    describe('When its invoked', () => {
        test('When the authString is empty in who, it should return an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce(false),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
