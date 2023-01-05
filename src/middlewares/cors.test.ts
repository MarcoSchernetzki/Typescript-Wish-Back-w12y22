import { NextFunction, Request, Response } from 'express';
import { setCors } from './cors';

describe('Given the cors middleware', () => {
    describe('When it is called', () => {
        const req: Partial<Request> = {
            header: jest.fn().mockReturnValue('*'),
        };
        const res: Partial<Response> = {
            setHeader: jest.fn(),
        };
        const next: NextFunction = jest.fn();

        test('Then it should set the Access-Control-Allow-Origin header', () => {
            setCors(req as Request, res as Response, next);
            expect(res.setHeader).toHaveBeenCalledWith(
                'Access-Control-Allow-Origin',
                '*'
            );
        });

        test('Then if the req.header is "Origin", it should add the origin value as "Origin"', () => {
            req.header = jest.fn().mockReturnValue('Origin');
            setCors(req as Request, res as Response, next);
            expect(res.setHeader).toHaveBeenCalledWith(
                'Access-Control-Allow-Origin',
                'Origin'
            );
        });
    });
});
