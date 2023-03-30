module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-paper/babel",
      ["transform-inline-environment-variables"],
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
