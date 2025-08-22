// Configuration ESLint v9 simplifiée
module.exports = [
  {
    // Configuration pour tailwind.config.js qui utilise ES modules
    files: ["tailwind.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        module: "writable",
        require: "readonly",
        __dirname: "readonly",
        process: "readonly",
      },
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },
  {
    // Configuration pour les autres fichiers de configuration Node.js
    files: ["*.config.js", "babel.config.js"],
    ignores: ["tailwind.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        module: "writable",
        require: "readonly",
        __dirname: "readonly",
        process: "readonly",
      },
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },
  {
    // Configuration pour les fichiers JavaScript React
    files: ["**/*.{js,jsx}"],
    ignores: ["dist/**", "node_modules/**", "*.config.js", "babel.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"),
      "react-native": require("eslint-plugin-react-native"),
      "react-hooks": require("eslint-plugin-react-hooks"),
    },
    rules: {
      // Règles de base
      "no-console": "off", // Désactivé pour l'instant
      "no-unused-vars": "warn",
      "no-undef": "error",
      "react-native/no-inline-styles": "off", // Désactivé pour l'instant
      "react-hooks/exhaustive-deps": "off", // Désactivé pour l'instant

      // Règles de formatage
      "prettier/prettier": "warn",
    },
  },
  {
    // Configuration pour les fichiers TypeScript
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      prettier: require("eslint-plugin-prettier"),
      "react-native": require("eslint-plugin-react-native"),
      "react-hooks": require("eslint-plugin-react-hooks"),
    },
    rules: {
      // Règles de base
      "no-console": "off", // Désactivé pour l'instant
      "no-unused-vars": "off", // Désactivé en faveur de la règle TypeScript
      "@typescript-eslint/no-unused-vars": "warn",
      "no-undef": "off", // TypeScript gère cela

      // Règles de formatage
      "prettier/prettier": "warn",

      // Règles TypeScript spécifiques - configuration plus tolérante pour le développement
      "@typescript-eslint/no-explicit-any": "off", // Désactivé pour l'instant
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": "off", // Désactivé pour l'instant

      // Règles React Native et React Hooks
      "react-native/no-inline-styles": "off", // Désactivé pour l'instant
      "react-hooks/exhaustive-deps": "off", // Désactivé pour l'instant
    },
  },
];
