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
    },
    rules: {
      // Règles de base
      "no-console": "warn",
      "no-unused-vars": "warn",
      "no-undef": "error",

      // Règles de formatage
      "prettier/prettier": "warn",
    },
  },
  {
    // Configuration pour ignorer les fichiers TypeScript pour l'instant
    // Nous les configurerons correctement dans une prochaine étape
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.{ts,tsx}"],
  },
];
