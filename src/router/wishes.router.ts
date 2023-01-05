import { Router } from 'express';
import { WishRepository } from '../repositories/wish.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { WishController } from '../controllers/wish.controller.js';
import { logged, who } from '../middlewares/interceptors.js';

export const wishesRouter = Router();

const controller = new WishController(
    WishRepository.getInstance(),
    UserRepository.getInstance()
);

wishesRouter.get('/', controller.getAll.bind(controller));
wishesRouter.get('/:id', controller.getWish.bind(controller));
wishesRouter.get(
    '/find/:inspiration/:true',
    logged,
    controller.findInspo.bind(controller)
);
wishesRouter.post('/', logged, controller.postNew.bind(controller));
wishesRouter.patch('/:id', logged, who, controller.patch.bind(controller));
wishesRouter.delete('/:id', logged, who, controller.delete.bind(controller));
