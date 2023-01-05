import { UserI, User } from '../entities/user.js';
import { passwdEncrypt } from '../services/auth.js';
import { UserRepo, id } from './repo.js';
import createDebug from 'debug';
const debug = createDebug('Wishes:repositories:user');

export class UserRepository implements UserRepo {
    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    #Model = User;

    private constructor() {
        debug('instance');
    }

    async getUser(id: string | number): Promise<UserI> {
        debug('getUser', id);
        const result = await this.#Model.findById(id).populate('myWishes');
        if (!result) throw new Error('Not found id');
        return result;
    }

    async update(id: id, data: Partial<UserI>): Promise<UserI> {
        debug('update');
        const result = await this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('myWishes');
        if (!result) throw new Error('Not found id');
        return result;
    }

    async findUser(search: Partial<UserI>): Promise<UserI> {
        debug('findUser');
        const result = await this.#Model.findOne(search).populate('myWishes');
        if (!result) throw new Error('Not found id');
        return result;
    }

    async postNewUser(data: Partial<UserI>): Promise<UserI> {
        debug('postNewUser');
        if (typeof data.passwd !== 'string') throw new Error('');
        data.passwd = await passwdEncrypt(data.passwd);
        data.role = 'user';
        const result = await this.#Model.create(data);
        return result;
    }
}
