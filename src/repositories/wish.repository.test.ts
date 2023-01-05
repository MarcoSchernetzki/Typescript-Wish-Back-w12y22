import mongoose from 'mongoose';
import { dbConnect } from '../db/db.connect.js';
import { Wish } from '../entities/wish.js';
import { WishRepository } from './wish.repository.js';

const mock = [
    {
        inspiration: true,
        name: 'Sombrero',
        comeTrue: false,
    },
    {
        inspiration: true,
        name: 'Guantes',
        comeTrue: false,
    },
];

describe('Given WishRespository', () => {
    describe('When we instantiate it', () => {
        const repository = WishRepository.getInstance();
        let testIds: Array<string>;

        beforeAll(async () => {
            await dbConnect();
            await Wish.deleteMany();
            await Wish.insertMany(mock);
            const data = await Wish.find();
            testIds = [data[0].id, data[1].id];
        });

        afterAll(() => {
            mongoose.disconnect();
        });

        test('Then getAll should have been called', async () => {
            const result = await repository.getAll();
            expect(result[0].name).toEqual(mock[0].name);
        });

        test('Then getWish should have been called', async () => {
            const result = await repository.getWish(testIds[0]);
            expect(result.name).toEqual(mock[0].name);
        });

        test('Then getWish should throw an error', async () => {
            expect(async () => {
                await repository.getWish(testIds[2]);
            }).rejects.toThrowError();
        });

        test('Then find not come true wishes, should have been called', async () => {
            const result = await repository.findInspo({
                comeTrue: false,
            });
            expect(result[0].name).toBe('Sombrero');
        });

        test('Then find come true wishes, should have been called', async () => {
            const result = await repository.findInspo({ comeTrue: true });
            expect(result).toEqual([]);
        });

        test('Then post should have been called', async () => {
            const newWish = {
                name: 'Calcetines',
            };
            const result = await repository.postNew(newWish);
            expect(result.name).toEqual(newWish.name);
        });

        test('Then patch should have been called', async () => {
            const result = await repository.patch(testIds[0], {
                name: 'Sombrero',
            });
            expect(result.name).toEqual(mock[0].name);
        });

        test('Then patch should have been called', async () => {
            expect(async () => {
                await repository.patch(testIds[10], { name: 'gorro' });
            }).rejects.toThrowError();
        });

        test('Then delete should have been called', async () => {
            const result = await repository.delete(testIds[0]);
            expect(result).toEqual(testIds[0]);
        });

        test('Then delete should throw an error', async () => {
            expect(async () => {
                await repository.delete(testIds[3]);
            }).rejects.toThrowError(Error);
        });

        test('Then delete should throw an error', async () => {
            expect(async () => {
                await repository.delete('123456789012345678901234');
            }).rejects.toThrowError(Error);
        });

        test('Then if the id is incorrectly formated, delete should throw an error', async () => {
            expect(async () => {
                await repository.delete(1);
            }).rejects.toThrowError(mongoose.Error.CastError);
        });
    });
});
