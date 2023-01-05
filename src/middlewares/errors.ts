import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../interfaces/error.js';

export const errorManager = (
    error: CustomError,
    _req: Request,
    resp: Response,
    _next: NextFunction
) => {
    let status = error.statusCode || 500;
    if (error.name === 'ValidationError') {
        status = 406;
    }
    const result = {
        status: status,
        type: error.name,
        error: error.message,
    };
    _next();
    resp.status(status);
    resp.json(result);
    resp.end();
};
