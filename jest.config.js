module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@shared(.*)$': '<rootDir>/core/shared$1',
    '^@units(.*)$': '<rootDir>/core/units$1',
    '^@patients(.*)$': '<rootDir>/core/patients$1',
    '^@reminders(.*)$': '<rootDir>/core/reminders$1',
    '^@medical-records(.*)$': '<rootDir>/core/medical-records$1',
    '^@sharedAcl(.*)$': '<rootDir>/core/sharedAcl$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.expo/'
  ],
  collectCoverageFrom: [
    'core/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ]
};

