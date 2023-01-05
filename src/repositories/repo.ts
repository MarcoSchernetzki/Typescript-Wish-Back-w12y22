import { UserI } from '../entities/user.js';
import { WishI } from '../entities/wish.js';

export type id = number | string;

export interface WishRepo {
    getAll: () => Promise<Array<WishI>>;
    getWish: (id: id) => Promise<WishI>;
    findInspo: (data: Partial<WishI>) => Promise<WishI[]>;
    postNew: (data: Partial<WishI>) => Promise<WishI>;
    patch: (id: id, data: Partial<WishI>) => Promise<WishI>;
    delete: (id: id) => Promise<id>;
}

export interface UserRepo {
    getUser: (id: id) => Promise<UserI>;
    update: (id: id, data: Partial<UserI>) => Promise<UserI>;
    findUser: (data: Partial<UserI>) => Promise<UserI>;
    postNewUser: (data: Partial<UserI>) => Promise<UserI>;
}
