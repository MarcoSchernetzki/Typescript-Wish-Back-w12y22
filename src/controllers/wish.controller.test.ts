import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../middlewares/interceptors.js';
import { UserRepository } from '../repositories/user.repository.js';
import { WishRepository } from '../repositories/wish.repository.js';
import { WishController } from './wish.controller.js';

describe('Given wish controller', () => {
    let wishRepository: WishRepository;
    let wishController: WishController;
    let userRepository: UserRepository;
    let req: Partial<ExtraRequest>;
    let resp: Partial<Response>;
    let next: NextFunction;

    const mock = { wishes: ['wish'] };

    beforeEach(() => {
        wishRepository = WishRepository.getInstance();
        userRepository = UserRepository.getInstance();

        wishRepository.getAll = jest.fn().mockResolvedValue(['wish']);
        wishRepository.getWish = jest.fn().mockResolvedValue({
            id: 1,
            owner: { id: '123456789012345678901234' },
        });
        wishRepository.findInspo = jest.fn().mockResolvedValue(['wish']);
        wishRepository.postNew = jest.fn().mockResolvedValue(['wish']);
        wishRepository.patch = jest.fn().mockResolvedValue('wish');
        wishRepository.delete = jest.fn().mockResolvedValue('wish');
        userRepository.getUser = jest.fn().mockResolvedValue({
            id: '123456789012345678901234',
            myWishes: [],
        });
        userRepository.update = jest.fn();
        wishController = new WishController(wishRepository, userRepository);
        req = {
            body: { owner: '123456789012345678901234' },
            params: { id: '123456789012345678901234' },
            payload: { id: '123456789012345678901234' },
        };
        resp = {
            status: jest.fn().mockReturnValue(201),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe('When getAll is called', () => {
        test('Then it should return a response with the wishes', async () => {
            await wishController.getAll(req as Request, resp as Response, next);
            expect(resp.status).toHaveBeenCalledWith(201);
            expect(resp.json).toHaveBeenCalledWith(mock);
        });

        test('Then it should return an error if wishRepository returns error', async () => {
            wishRepository.getAll = jest
                .fn()
                .mockRejectedValue(new Error('Error'));
            await wishController.getAll(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });

    describe('When getWish is called', () => {
        test('Then it should return a response with the wish', async () => {
            await wishController.getWish(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.status).toHaveBeenCalledWith(201);
        });

        test('Then it should return an error if wishRepository returns error', async () => {
            wishRepository.getWish = jest
                .fn()
                .mockRejectedValue(new Error('Error'));
            await wishController.getWish(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });

    describe('When findInspo is called', () => {
        test('It should return the wishes with the name searched', async () => {
            wishRepository.findInspo = jest.fn().mockResolvedValue(['wish']);
            await wishController.findInspo(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.status).toHaveBeenCalledWith(201);
            expect(resp.json).toHaveBeenCalledWith(mock);
        });

        test('Then it should throw an error when it is fed incorrect information', async () => {
            wishRepository.findInspo = jest
                .fn()
                .mockRejectedValue(new Error('Error'));
            await wishController.findInspo(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });

    describe('When postNew is called', () => {
        test('Then post should have been called', async () => {
            await wishController.postNew(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.status).toHaveBeenCalledWith(201);
            expect(resp.json).toHaveBeenCalledWith(mock);
        });
        test('Then when postNew is called with incorrect information, it should return an error', async () => {
            wishRepository.postNew = jest
                .fn()
                .mockRejectedValue(new Error('Error'));
            await wishController.postNew(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });

        test('Then when postNew is called with incorrect payload, it should return an error', async () => {
            req = {
                params: { id: '' },
            };
            await wishController.postNew(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error('Invalid payload'));
        });
    });

    describe('When patch is called', () => {
        test('Then it should return the wish with the updated value', async () => {
            await wishController.patch(req as Request, resp as Response, next);
            expect(resp.status).toHaveBeenCalledWith(201);
        });

        test('Then when patch is called with incorrect information, it should return an error', async () => {
            wishRepository.patch = jest
                .fn()
                .mockRejectedValue(new Error('Error'));
            await wishController.patch(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });

    describe('When delete is called', () => {
        test('Then it should return the wish with the updated value', async () => {
            await wishController.delete(req as Request, resp as Response, next);
            expect(resp.status).toHaveBeenCalledWith(201);
        });
        test('Then it should return the wish with the updated values', async () => {
            userRepository.getUser = jest.fn().mockResolvedValue({
                id: '123456789012345678901234',
                myWishes: [1],
            });
            await wishController.delete(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test('Then when delete is called with incorrect information, it should return an error', async () => {
            wishRepository.delete = jest
                .fn()
                .mockRejectedValue(new Error('Error'));
            await wishController.delete(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });

    describe('When we instantiate createHttpError(),', () => {
        const error: CustomError = new HTTPError(
            404,
            'Not found id',
            'Message of error'
        );
        test('It should throw the correct message', async () => {
            error.message = 'Not found id';
            await wishController.createHttpError(error);
            expect(error.message).toBe('Not found id');
        });
    });
});
