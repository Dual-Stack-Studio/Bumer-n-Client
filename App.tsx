import "./global.css";
import React, { useEffect } from "react"; // <-- 1. Importa useEffect aquí
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Importaciones de tus pantallas
import WelcomeScreen from "./src/screens/auth/WelcomeScreen";
import MainScreen from "./src/screens/favores/MainScreenFavores";
import DetailScreen from "./src/screens/favores/DetailScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import PedirFavorScreen from "./src/screens/favores/flujo-pedir/PedirFavorScreen";
import ProfileScreen from "./src/screens/profile/ProfileScreen";
import FavoritosScreen from "./src/screens/favoritos/FavoritosScreen";
import NotificationsScreen from "./src/screens/notifications/NotificationsScreen";
import ReviewScreen from "./src/screens/reviews/ReviewScreen";
import ConexionesScreen from "./src/screens/conexiones/ConexionesScreen";
import { FavoritosProvider } from "./src/context/FavoritosContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import { AuthProvider } from "./src/context/AuthContext";

export type RootStackParamList = {
  Welcome: undefined;
  Main: { intencion?: "necesito" | "ofrezco" } | undefined;
  Detail: { favor: any };
  Login: { redirectTo?: keyof RootStackParamList } | undefined;
  RequestFavor: { favorEditar?: any } | undefined;
  Profile: undefined;
  Favoritos: undefined;
  Notifications: undefined;
  Review: { favor: any };
  Conexiones: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // 2. LO MOVEMOS AQUÍ ADENTRO: Se ejecuta solo una vez cuando la app ya está montada y lista
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "51752012600-02jg5en0mi2g4pito7hjdinvg48a47ne.apps.googleusercontent.com",

      offlineAccess: true,
    });
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
      <AuthProvider>
      <FavoritosProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
            <Stack.Screen name="RequestFavor" component={PedirFavorScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Favoritos" component={FavoritosScreen} />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
            />

            <Stack.Screen name="Review" component={ReviewScreen} />
            <Stack.Screen name="Conexiones" component={ConexionesScreen} />

            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritosProvider>
      </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
