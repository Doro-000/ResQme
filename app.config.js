module.exports = {
  expo: {
    scheme: "resqme",
    name: "ResQme",
    slug: "ResQme",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/ResQme_Icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./src/assets/ResQme_splash.png",
      resizeMode: "contain",
      backgroundColor: "#D9D9D9",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.ResQ.me",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
      ],
      userInterfaceStyle: "light",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAP_KEY,
        },
      },
    },
    web: {
      favicon: "./src/assets/ResQme_favicon.png",
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "7439e976-f17d-4b78-a74e-6cc292acc4f9",
      },
    },
    owner: "haberra",
  },
};
