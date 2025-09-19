module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],

    plugins: [
      ["@babel/plugin-transform-typescript", {
        allowDeclareFields: true,
        allowNamespaces: true,
        isTSX: true,
        allExtensions: true

      }],
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      // ["@babel/plugin-proposal-class-properties", { loose: true }],
      [
        "module-resolver",
        {
          root: ["./"],

          alias: {
            "@": "./",
            "tailwind.config": "./tailwind.config.js",
          },
        },
      ],
      ["inline-import", { extensions: [".sql"] }],
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-worklets/plugin"
    ],
  };
};
