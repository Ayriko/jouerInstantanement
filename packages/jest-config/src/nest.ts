import type { Config } from 'jest';
import { config as baseConfig } from './base';

const sharedNestConfig = {
    ...baseConfig,
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@repo/(.+)$': '<rootDir>/../../packages/$1/src',
    },
    testEnvironment: 'node',
} satisfies Config;

export const nestConfig = {
    ...sharedNestConfig,
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
} as const satisfies Config;

export const nestE2eConfig = {
    ...sharedNestConfig,
    rootDir: '.',
    testRegex: '.e2e-spec.ts$',
    passWithNoTests: true,
} as const satisfies Config;
