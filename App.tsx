import "./global.css";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // ¡Clave para que no se rompa el diseño con el notch!

// Importaciones de tus pantallas
import WelcomeScreen from './src/screens/WelcomeScreen';
import MainScreen from './src/screens/Necesito-Favores/MainScreenFavores';
import DetailScreen from './src/screens/Necesito-Favores/DetailScreen';
import LoginScreen from './src/screens/LoginScreen'; // Asegúrate de que esta ruta coincida donde guardaste el archivo

// 1. Agregamos la ruta 'Detail' y le decimos que recibe un parámetro llamado 'favor'
export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  Detail: { favor: any }; // Recibe el objeto completo con la foto, título, etc.
  Login: undefined;  // <-- Y agrega esta
};

// 2. Creamos el Stack tipado
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // 3. Envolvemos toda la app en SafeAreaProvider para solucionar el warning que tenías antes
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome" // Empieza en Welcome como lo tenías planeado
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Group>
          {/* 4. Registramos nuestra nueva pantalla de detalles */}
          <Stack.Screen name="Detail" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}