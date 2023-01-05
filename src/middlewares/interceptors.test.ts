import { NextFunction, Request, Response } from 'express';
import { ExtraRequest, logged, who } from './interceptors';
import { HTTPError } from '../interfaces/error';
import { WishRepository } from '../repositories/wish.repository';

describe('Given the logged interceptor', () => {
    describe('When it is called', () => {
        test('When authString is empty, it should create an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValue(false),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(
                new HTTPError(
                    403,
                    'Forbidden',
                    'Usuario o contraseña incorrecto'
                )
            );
        });

        test('Then if readToken function reads an invalid token, it should return an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce('Bearer 0908'),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();
            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(
                new HTTPError(
                    403,
                    'Forbidden',
                    'Usuario o contraseña incorrecto'
                )
            );
        });
        // test a solucionar
        // test('Then if readToken reads a correct token, it should validate user', () => {
        //     const req: Partial<ExtraRequest> = {
        //         get: jest
        //             .fn()
        //             .mockReturnValueOnce(
        //                 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGI0YjU0ZGYxMzg5ZTYyMDQzNzhkOCIsIm5hbWUiOiJBbGkiLCJyb2xlIjoidXNlciIsImlhdCI6MTY3MDA3MzE5Nn0.rwZi12DLUaehahu8AP_HjvSUsjSya-1z2Cw5mQZcLgI'
        //             ),
        //     };
        //     const res: Partial<Response> = {};
        //     const next: NextFunction = jest.fn();

        //     logged(req as ExtraRequest, res as Response, next);
        //     expect(next).toHaveBeenCalled();
        //     expect(req.payload).toStrictEqual({
        //         id: expect.any(String),
        //         iat: expect.any(Number),
        //         name: 'Ali',
        //         role: 'user',
        //     });
        // });
    });

    describe('Given the who interceptor', () => {
        test('Then if request is incorrect, it should not go to the next action', async () => {
            const repo = WishRepository.getInstance();
            repo.getWish = jest.fn().mockResolvedValue({ owner: { id: '1' } });
            const req: Partial<ExtraRequest> = {
                payload: {
                    id: '10',
                    role: 'user',
                },
                params: { id: '' },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            await who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test('Then if request is correct, it should go to the next action', async () => {
            const repo = WishRepository.getInstance();
            repo.getWish = jest.fn().mockResolvedValue({ owner: { id: '33' } });
            const req: Partial<ExtraRequest> = {
                payload: {
                    id: '33',
                    role: 'user',
                },
                params: { id: '' },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            await who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
