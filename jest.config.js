module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "@shared": "<rootDir>/core/shared",
    "@evaluation": "<rootDir>/core/evaluation",
    "@medical_record": "<rootDir>/core/medical_record",
    "@nutrition_care": "<rootDir>/core/nutrition_care",
    "@patient": "<rootDir>/core/patient",
    "@reminders": "<rootDir>/core/reminders",
    "@units": "<rootDir>/core/units",
    "^@shared/(.*)$": "<rootDir>/core/shared/$1",
    "^@core/(.*)$": "<rootDir>/core/$1",
    "^@adapter/(.*)$": "<rootDir>/adapter/$1",
    "^@context/(.*)$": "<rootDir>/src/context/$1",
    "^@pages/(.*)$": "<rootDir>/components/pages/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@services/(.*)$": "<rootDir>/adapter/services/$1",
    "^@config/(.*)$": "<rootDir>/adapter/config/$1",
    "^@/(.*)$": "<rootDir>/$1",
  },

  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],

  // Configuration modifiée pour exclure les fichiers utilitaires
  testMatch: [
    "**/tests/**/*.test.ts?(x)",
    "**/tests/**/*.spec.ts?(x)",
    "**/?(*.)+(spec|test).ts?(x)",
  ],

  // Ignorer les fichiers utilitaires et de setup
  testPathIgnorePatterns: [
    "/node_modules/",
    "/tests/utils/",
    "/tests/__helpers__/",
    "/tests/setup.ts",
  ],

  collectCoverageFrom: [
    "core/**/*.{ts,tsx}",
    "!core/**/*.d.ts",
    "!core/**/index.ts",
    "!core/**/*.types.ts",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/tests/",
    "/tests/utils/",
    "/tests/__helpers__/",
  ],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  // Formats de rapport de coverage
  coverageReporters: [
    "text", // Affichage dans le terminal
    "html", // Rapport HTML détaillé
    "lcov", // Pour les outils CI/CD
    "clover", // Format XML
  ],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};
