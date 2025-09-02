module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '@shared': '<rootDir>/core/shared',
    '@evaluation': '<rootDir>/core/evaluation',
    '@medical_record': '<rootDir>/core/medical_record',
    '@nutrition_care': '<rootDir>/core/nutrition_care',
    '@patient': '<rootDir>/core/patient',
    '@reminders': '<rootDir>/core/reminders',
    '@units': '<rootDir>/core/units',
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'core/**/*.{ts,tsx}',
    '!core/**/*.d.ts',
    '!core/**/index.ts',
    '!core/**/*.types.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

