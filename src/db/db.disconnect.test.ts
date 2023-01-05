import { dbConnect } from './db.connect.js';
import { dbDisconnect } from './db.disconnect';

describe('Given db.disconnect', () => {
    test('When we instantiate it should return 0', async () => {
        await dbConnect();
        const result = await dbDisconnect();
        expect(result).toBe(0);
    });
});
