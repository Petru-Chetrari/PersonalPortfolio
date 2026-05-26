import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts', // entry point excluded — no unit-testable logic
  ],
  coverageThreshold: {
    global: {
      lines: 88,
      functions: 93,
      branches: 74,
      statements: 88,
    },
  },
};

export default config;
