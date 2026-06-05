import "./global.css";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MainScreen from './src/screens/Necesito-Favores/MainScreenFavores';

// 1. Definimos las rutas y los tipos de parámetros que reciben (en este caso, ninguno)
export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
};

// 2. Creamos el Stack tipado
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}