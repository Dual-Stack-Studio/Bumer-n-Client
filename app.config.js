import 'dotenv/config';

export default {
  expo: {
    name: "client",
    slug: "client",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    // userInterfaceStyle: "light", // COMENTA ESTO hasta que instales expo-system-ui
    newArchEnabled: false,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      // Elimina la línea edgeToEdgeEnabled: true, (Ya no es necesaria)
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      package: "com.sebita1495.client"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysPermission: "Necesitamos tu ubicación para mostrarte favores cercanos."
        }
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static"
          }
        }
      ],
      "expo-status-bar"
    ]
  }
};