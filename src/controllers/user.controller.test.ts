import { Types } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller.js';
import { UserRepository } from '../repositories/user.repository.js';
import { WishRepository } from '../repositories/wish.repository.js';
import { createToken, passwdValidate } from '../services/auth.js';
import { CustomError, HTTPError } from '../interfaces/error';

jest.mock('../services/auth.js');

const userId = new Types.ObjectId();

const mock = [
    {
        id: userId,
        name: 'Lola',
        passwd: 'LolaLola',
        email: 'lola@gmail.com',
        role: 'user',
    },
    {
        id: userId,
        name: 'Mar',
        passwd: 'Mar123',
        email: 'mar@gmail.com',
        role: 'user',
    },
];

describe('Given the user controller', () => {
    describe('When we instantiate it', () => {
        let userRepository: UserRepository;
        let wishRepository: WishRepository;
        let userController: UserController;
        let req: Partial<Request>;
        let resp: Partial<Response>;
        let next: NextFunction;

        beforeEach(() => {
            userRepository = UserRepository.getInstance();
            wishRepository = WishRepository.getInstance();

            userRepository.getUser = jest.fn().mockResolvedValue(mock[0]);
            userRepository.findUser = jest.fn().mockResolvedValue(mock[0]);
            userRepository.postNewUser = jest.fn().mockResolvedValue(mock[0]);
            userController = new UserController(wishRepository, userRepository);
            req = { params: { id: '123456789012345678901234' } };
            resp = {};
            resp.status = jest.fn().mockReturnValue(resp);
            next = jest.fn();
            resp.json = jest.fn();
        });

        test('Then getUser should be called', async () => {
            await userController.getUser(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith({ user: mock[0] });
        });

        test('Then register should be called', async () => {
            await userController.register(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith({ user: mock[0] });
        });

        test('Then login should be called', async () => {
            req.body = { email: mock[0].email };
            await userRepository.findUser({ email: req.body.email });
            (passwdValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            await userController.login(req as Request, resp as Response, next);
            expect(resp.json).toHaveBeenCalledWith({
                token: 'token',
                user: mock[0],
            });
        });

        describe('When we instantiate login()', () => {
            test('With an invalid password it should throw error', async () => {
                const error: CustomError = new HTTPError(
                    404,
                    'Not Found id',
                    'message of error'
                );
                (passwdValidate as jest.Mock).mockResolvedValue(false);
                (createToken as jest.Mock).mockReturnValue('token');
                req.body = { passwd: 'Hola' };
                await userController.login(
                    req as Request,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(HTTPError);
            });
        });
    });
});

describe('Given the userController, but everything goes wrong', () => {
    let userRepository: UserRepository;
    let wishRepository: WishRepository;
    let userController: UserController;
    let req: Partial<Request>;
    let resp: Partial<Response>;
    let next: NextFunction;
    let error: CustomError;

    beforeEach(() => {
        error = new HTTPError(404, 'Not Found', 'Message of error');
        userRepository = UserRepository.getInstance();
        wishRepository = WishRepository.getInstance();

        userRepository.getUser = jest.fn().mockRejectedValue([mock]);
        userRepository.postNewUser = jest.fn().mockRejectedValue([mock]);

        userController = new UserController(wishRepository, userRepository);
        req = {};
        resp = { json: jest.fn() };
        next = jest.fn();
    });

    test('Then if something went wrong getUser should throw an error', async () => {
        await userController.getUser(req as Request, resp as Response, next);
        expect(error).toBeInstanceOf(HTTPError);
    });

    test('Then if something went wrong register should throw an error', async () => {
        await userController.register(req as Request, resp as Response, next);
        expect(error).toBeInstanceOf(HTTPError);
    });

    describe('When we instantiate login()', () => {
        test('It should throw an error', async () => {
            await userController.login(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('When we instantiate register()', () => {
        test('It should throw an error', async () => {
            await userController.register(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('When we instantiate createHttpError(),', () => {
        test('It should throw the correct message', async () => {
            error.message = 'Not found id';
            await userController.createHttpError(error);
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe('Not found id');
        });
    });
});
