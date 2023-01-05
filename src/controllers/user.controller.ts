import { NextFunction, Request, Response } from 'express';
import { WishRepo, UserRepo } from '../repositories/repo.js';
import { HTTPError } from '../interfaces/error.js';
import { createToken, passwdValidate } from '../services/auth.js';
import createDebug from 'debug';
const debug = createDebug('Wish:controller');

export class UserController {
    constructor(
        public readonly wishRepo: WishRepo,
        public readonly userRepo: UserRepo
    ) {}

    async getUser(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('getUser');
            const user = await this.userRepo.getUser(req.params.id);
            resp.status(201);
            resp.json({ user });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    async register(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('register');
            const user = await this.userRepo.postNewUser(req.body);
            resp.status(201).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async login(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('login');
            const user = await this.userRepo.findUser({
                email: req.body.email,
            });

            const isPasswdValid = await passwdValidate(
                req.body.passwd,
                user.passwd
            );
            if (!isPasswdValid) throw new Error();
            const token = createToken({
                id: user.id.toString(),
                name: user.name.toString(),
                role: user.role.toString(),
            });
            resp.status(201);
            resp.json({ token, user });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    createHttpError(error: Error) {
        if (error.message === 'Not found id') {
            const httpError = new HTTPError(404, 'Not Found', error.message);
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
