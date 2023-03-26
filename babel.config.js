module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-paper/babel",
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
        },
      ],
      [
        "module-resolver",
        {
          alias: {
            "@assets": "./src/assets",
            "@firebaseConfig": "./firebaseConfig.js",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
