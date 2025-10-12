/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'jest-expo',
  roots: ['<rootDir>/src', '<rootDir>'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};