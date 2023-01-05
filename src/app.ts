import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { setCors } from './middlewares/cors.js';
import { errorManager } from './middlewares/errors.js';
import { wishesRouter } from './router/wishes.router.js';
import { usersRouter } from './router/users.router.js';

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
    origin: '*',
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use(setCors);

app.get('/', (_req, res) => {
    res.send('iWish App').end();
});

app.use('/wishes', wishesRouter);
app.use('/users', usersRouter);

app.use(errorManager);
