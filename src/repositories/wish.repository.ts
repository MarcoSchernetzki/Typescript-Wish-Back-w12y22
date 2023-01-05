import { Types } from 'mongoose';
import { WishI, Wish } from '../entities/wish.js';
import { WishRepo, id } from './repo.js';

export class WishRepository implements WishRepo {
    static instance: WishRepository;

    public static getInstance(): WishRepository {
        if (!WishRepository.instance) {
            WishRepository.instance = new WishRepository();
        }
        return WishRepository.instance;
    }

    #Model = Wish;

    private constructor() {
        //
    }

    async getAll(): Promise<Array<WishI>> {
        return this.#Model.find().populate('owner', {
            wishes: 0,
        });
    }

    async getWish(id: id): Promise<WishI> {
        const result = await this.#Model
            .findById(id)
            .populate<{ _id: Types.ObjectId }>('owner', {
                wishes: 0,
            });
        if (!result) throw new Error('Not found id');
        return result;
    }

    async findInspo(search: Partial<WishI>): Promise<WishI[]> {
        const result = await this.#Model.find(search);
        return result;
    }

    async postNew(data: Partial<WishI>): Promise<WishI> {
        data.comeTrue = false;
        data.inspiration = false;
        const result = await this.#Model.create(data);
        return result;
    }

    async patch(id: id, data: Partial<WishI>): Promise<WishI> {
        const result = await this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('owner', {
                wishes: 0,
            });
        if (!result) throw new Error('Not found id');
        return result;
    }

    async delete(id: id): Promise<id> {
        await this.#Model.findByIdAndDelete(id).populate('owner', {
            wishes: 0,
        });
        return id;
    }
}
