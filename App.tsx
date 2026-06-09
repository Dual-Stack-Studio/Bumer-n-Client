import "./global.css";
import React, { useEffect } from 'react'; // <-- 1. Importa useEffect aquí
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 

import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Importaciones de tus pantallas
import WelcomeScreen from './src/screens/WelcomeScreen';
import MainScreen from './src/screens/Necesito-Favores/MainScreenFavores';
import DetailScreen from './src/screens/Necesito-Favores/DetailScreen';
import LoginScreen from './src/screens/LoginScreen'; 
import PedirFavorScreen from './src/screens/Necesito-Favores/PedirFavorScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  Detail: { favor: any }; 
  Login: undefined;  
  RequestFavor: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  // 2. LO MOVEMOS AQUÍ ADENTRO: Se ejecuta solo una vez cuando la app ya está montada y lista
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '51752012600-02jg5en0mi2g4pito7hjdinvg48a47ne.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome" 
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="RequestFavor" component={PedirFavorScreen} />
          
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}