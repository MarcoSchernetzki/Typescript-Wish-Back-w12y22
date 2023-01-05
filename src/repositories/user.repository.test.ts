import { UserI } from './../entities/user';
import mongoose from 'mongoose';
import { dbConnect } from '../db/db.connect.js';
import { User } from '../entities/user.js';
import { UserRepository } from './user.repository.js';
import { WishRepository } from './wish.repository.js';

const mock = [
    {
        name: 'Pepe',
        email: 'pepe@gmail.com',
        passwd: 'Pepe123',
        role: 'user',
    },
    {
        name: 'Pepa',
        email: 'pepa@email.com',
        passwd: 'Pepa321',
        role: 'user',
    },
];

describe('Given UserRespository', () => {
    describe('When we instantiate it', () => {
        const repository = UserRepository.getInstance();
        WishRepository.getInstance();
        let testIds: Array<string>;

        beforeEach(async () => {
            await dbConnect();
            await User.deleteMany();
            await User.insertMany(mock);
            const data = await User.find();
            testIds = [data[0].id, data[1].id];
        });

        afterEach(() => {
            mongoose.disconnect();
        });

        test('Then getUser should have been called', async () => {
            const result = await repository.getUser(testIds[0]);
            expect(result.email).toBe('pepe@gmail.com');
        });

        test('Then getUser should throw an error', async () => {
            expect(async () => {
                await repository.getUser('638bd837cb2b7d4a02e79359');
            }).rejects.toThrowError();
        });

        describe('When we instantiate update()', () => {
            test('Then it should return one user', async () => {
                await repository.update(testIds[0], mock[0] as UserI);
                expect(mock[0].name).toEqual('Pepe');
            });

            test('and receives an invalid id it should return an error', async () => {
                expect(async () => {
                    await repository.update(testIds[4], mock[1] as UserI);
                }).rejects.toThrowError();
            });
        });

        describe('When we instantiate findUser()', () => {
            test('Then find should have been called', async () => {
                const result = await repository.findUser({ name: 'Pepe' });
                expect(result.email).toBe('pepe@gmail.com');
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
                    passwd: '',
                };
                expect(async () => {
                    await repository.postNewUser(newUser);
                }).rejects.toThrowError();
            });
        });
    });
});
