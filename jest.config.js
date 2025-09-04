module.exports = {
  preset: "jest-expo",
  moduleNameMapper: {
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
};
