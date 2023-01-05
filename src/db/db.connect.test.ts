import { dbConnect } from './db.connect.js';
import mongoose from 'mongoose';

describe('Given dbConnect', () => {
    test('When we instantiate it should make a connection', async () => {
        const result = await dbConnect();
        expect(typeof result).toBe(typeof mongoose);
        mongoose.disconnect();
    });
});

describe('Given dbConnect', () => {
    test('When we instantiate it should make a connection', async () => {
        process.env.NODE_ENV = 'nottesting';
        const result = await dbConnect();
        expect(typeof result).toBe(typeof mongoose);
        mongoose.disconnect();
    });
});
