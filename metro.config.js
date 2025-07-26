/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("sql");
config.resolver.assetExts.push("wasm");

module.exports = withNativeWind(config, { input: "./global.css" });
