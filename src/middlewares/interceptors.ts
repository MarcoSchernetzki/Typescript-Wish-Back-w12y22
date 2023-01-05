import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HTTPError } from '../interfaces/error.js';
import { UserRepository } from '../repositories/user.repository.js';
import { readToken } from '../services/auth.js';
import createDebug from 'debug';
const debug = createDebug('Wish:interceptor');

export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}

export const logged = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('logged');
    const authString = req.get('Authorization');
    if (!authString || !authString?.startsWith('Bearer')) {
        next(
            new HTTPError(403, 'Forbidden', 'Usuario o contraseña incorrecto')
        );
        return;
    }
    try {
        const token = authString.slice(7);
        readToken(token);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'Forbidden', 'Usuario o contraseña incorrecto')
        );
    }
};

export const who = async (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('who');
    const userRepository = UserRepository.getInstance();
    try {
        const user = await userRepository.getUser(
            (req.payload as JwtPayload).id
        );

        if (req.payload && user.id.toString() !== req.payload.id) {
            throw new HTTPError(
                403,
                'Forbidden',
                'Usuario o contraseña incorrecto'
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};
