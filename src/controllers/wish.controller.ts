import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { UserRepo, WishRepo } from './../repositories/repo.js';
import { ExtraRequest } from '../middlewares/interceptors.js';
import createDebug from 'debug';
const debug = createDebug('Wish:interceptor');

export class WishController {
    constructor(public wishRepo: WishRepo, public userRepo: UserRepo) {}

    async getAll(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('getAll');
            const wishes = await this.wishRepo.getAll();
            resp.status(201);
            resp.json({ wishes });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service Unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async getWish(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('getWish');
            const wishes = await this.wishRepo.getWish(req.params.id);
            resp.status(201);
            resp.json({ wishes });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    async findInspo(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('findInspo');
            const wishes = await this.wishRepo.findInspo({
                inspiration: true,
            });
            resp.status(201);
            resp.json({ wishes });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    async postNew(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('postNew');
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.userRepo.getUser(req.payload.id);
            req.body.owner = user.id;
            const wishes = await this.wishRepo.postNew(req.body);
            user.myWishes.push(wishes.id);
            this.userRepo.update(user.id.toString(), {
                myWishes: user.myWishes,
            });
            resp.status(201);
            resp.json({ wishes });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    async patch(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('patch');
            const wish = await this.wishRepo.patch(req.params.id, req.body);
            resp.status(201);
            resp.json({ wish });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    async delete(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('delete');
            const wish = await this.wishRepo.getWish(req.params.id);
            const user = await this.userRepo.getUser(wish.owner.id.toString());
            await this.wishRepo.delete(wish.id.toString());
            const filter = user.myWishes.filter((item) => {
                return item._id.toString() !== wish.id.toString();
            });
            await this.userRepo.update(wish.owner.id.toString(), {
                myWishes: filter,
            });
            resp.status(201);
            resp.json({ id: wish.id });
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
