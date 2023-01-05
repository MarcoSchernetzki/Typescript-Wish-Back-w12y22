/** @type {import('ts-jest').JestConfigWithTsJest} */
const preset = 'ts-jest';
const testEnvironment = 'node';
const testPathIgnorePatterns = ['dist', 'node_modules'];
const coveragePathIgnorePatterns = ['src/entities'];
const resolver = 'jest-ts-webcompat-resolver';
export default {
    preset,
    testEnvironment,
    coveragePathIgnorePatterns,
    testPathIgnorePatterns,
    resolver,
};
