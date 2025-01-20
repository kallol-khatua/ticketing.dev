import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['./jest.setup.ts'],
    setupFilesAfterEnv: ['./src/test/setup.ts'],
};

export default config;