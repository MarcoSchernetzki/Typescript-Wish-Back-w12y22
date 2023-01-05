import { CustomError, HTTPError } from './error.js';

describe('Given the class CustomError', () => {
    let error: CustomError;
    beforeEach(() => {
        error = new HTTPError(508, 'Loop Detected', 'Infinite loop');
    });
    test('should first', () => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
        expect(error).toHaveProperty('statusCode', 508);
        expect(error).toHaveProperty('statusMessage', 'Loop Detected');
        expect(error).toHaveProperty('message', 'Infinite loop');
        expect(error).toHaveProperty('name', 'HTTPError');
    });
});
