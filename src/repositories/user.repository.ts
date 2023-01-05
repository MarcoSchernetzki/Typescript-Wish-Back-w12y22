import { UserI, User } from '../entities/user.js';
import { passwdEncrypt } from '../services/auth.js';
import { UserRepo, id } from './repo.js';

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
        //
    }

    async getUser(id: string | number): Promise<UserI> {
        const result = await this.#Model.findById(id).populate('myWishes');
        if (!result) throw new Error('Not found id');
        return result;
    }

    async update(id: id, data: Partial<UserI>): Promise<UserI> {
        const result = await this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('myWishes');
        return result as UserI;
    }

    async findUser(search: Partial<UserI>): Promise<UserI> {
        const result = await this.#Model.findOne(search).populate('myWishes');
        if (!result) throw new Error('Not found id');
        return result;
    }

    async postNewUser(data: Partial<UserI>): Promise<UserI> {
        if (typeof data.passwd !== 'string') throw new Error('');
        data.passwd = await passwdEncrypt(data.passwd);
        data.role = 'user';
        const result = await this.#Model.create(data);
        return result;
    }
}
