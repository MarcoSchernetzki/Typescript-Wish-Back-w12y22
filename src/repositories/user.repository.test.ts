import mongoose from 'mongoose';
import { dbConnect } from '../db/db.connect.js';
import { User } from '../entities/user.js';
import { UserRepository } from './user.repository.js';
import { WishRepository } from './wish.repository.js';

const mock = [
    {
        name: 'raul',
        email: 'raul@gmail.com',
        passwd: '123',
        myWishes: [],
    },
    {
        name: 'Pepa',
        email: 'pepa@email.com',
        passwd: '123',
        myWishes: [],
    },
];

describe('Given UserRespository', () => {
    describe('When we instantiate it', () => {
        const repository = UserRepository.getInstance();
        WishRepository.getInstance();
        let testIds: Array<string>;
        const setUpCollection = async () => {
            await dbConnect();
            await User.deleteMany();
            await User.insertMany(mock);
            const data = await User.find();
            return [data[0].id, data[1].id];
        };
        beforeAll(async () => {
            testIds = await setUpCollection();
        });

        const invalidId = '63b6f4246e1aeb4a2a1795f1';
        const badFormattedId = '4';

        describe('When we instantiate getUser()', () => {
            test('Then getUser should have been called', async () => {
                const result = await repository.getUser(testIds[0]);
                expect(result.email).toBe(mock[0].email);
            });

            test('Then getUser should throw an error', async () => {
                expect(async () => {
                    await repository.getUser(invalidId);
                }).rejects.toThrowError('Not found id');
            });
            test('Then getUser should throw an error', async () => {
                expect(async () => {
                    await repository.getUser(badFormattedId);
                }).rejects.toThrowError();
            });
        });

        describe('When we instantiate update()', () => {
            test('Then it should return one user', async () => {
                await repository.update(testIds[0], mock[0]);
                expect(mock[0].name).toEqual(mock[0].name);
            });
            test('and receives an invalid id it should return an error', async () => {
                expect(async () => {
                    await repository.update(invalidId, mock[0]);
                }).rejects.toThrowError();
            });
        });

        describe('When we instantiate findUser()', () => {
            test('Then find should have been called', async () => {
                const result = await repository.findUser({
                    name: mock[0].name,
                });
                expect(result.email).toBe(mock[0].email);
            });

            test('Then find should throw an error', async () => {
                expect(async () => {
                    await repository.findUser({ name: 'Paco' });
                }).rejects.toThrowError();
            });
        });

        describe('When we instantiate postNewUser()', () => {
            test('Then create should have been called', async () => {
                const testUser = {
                    name: 'Paco',
                    email: 'paco@email.com',
                    passwd: 'PacoPaco',
                };
                const result = await repository.postNewUser(testUser);
                expect(result.name).toEqual(testUser.name);
            });

            test('Then create should throw an error', async () => {
                const newUser = {
                    name: 'Chema',
                    email: 'chema@email.com',
                    passwd: 2 as unknown as string,
                };
                expect(async () => {
                    await repository.postNewUser(newUser);
                }).rejects.toThrowError();
            });
        });
        afterAll(() => {
            mongoose.disconnect();
        });
    });
});
