import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Notifications from 'expo-notifications';
import {
  loginConGoogle,
  guardarToken,
  obtenerToken,
  borrarToken,
  UsuarioBackend,
} from '../api/usuariosApi';
import { guardarPushToken } from '../api/notificacionesApi';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface AuthContextValue {
  usuario: UsuarioBackend | null;
  usuarioId: string | null;
  token: string | null;
  cargando: boolean;
  sincronizar: (idToken: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  refrescarUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function registrarPushToken(jwtToken: string) {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return;

    const projectId = '5d9041e3-1c90-479a-829f-6de1c3039c45';
    const { data: pushToken } = await Notifications.getExpoPushTokenAsync({ projectId });
    await guardarPushToken(pushToken, jwtToken);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Bumerán',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  } catch (e) {
    // Push no crítico — no interrumpir el flujo de login
    console.warn('[Push] No se pudo registrar el token:', e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioBackend | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const sincronizar = useCallback(async (idToken: string) => {
    const { token: jwtToken, usuario: backendUsuario } = await loginConGoogle(idToken);
    await guardarToken(jwtToken);
    setToken(jwtToken);
    setUsuario(backendUsuario);
    void registrarPushToken(jwtToken);
  }, []);

  const cerrarSesion = useCallback(async () => {
    await GoogleSignin.signOut();
    await borrarToken();
    setToken(null);
    setUsuario(null);
  }, []);

  const refrescarUsuario = useCallback(async () => {
    const tokenGuardado = await obtenerToken();
    if (!tokenGuardado) return;
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL || 'https://bumeran-backend-production.up.railway.app'}/api/auth/me`,
      { headers: { Authorization: `Bearer ${tokenGuardado}` } }
    );
    if (response.ok) {
      const backendUsuario: UsuarioBackend = await response.json();
      setUsuario(backendUsuario);
    }
  }, []);

  useEffect(() => {
    // Al arrancar, intentamos restaurar la sesión desde el token guardado.
    // El backend debe exponer GET /api/auth/me que valide el JWT y devuelva el usuario.
    const restaurarSesion = async () => {
      try {
        const tokenGuardado = await obtenerToken();
        if (!tokenGuardado) return;

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL || 'https://bumeran-backend-production.up.railway.app'}/api/auth/me`,
          { headers: { Authorization: `Bearer ${tokenGuardado}` } }
        );

        if (response.ok) {
          const backendUsuario: UsuarioBackend = await response.json();
          setToken(tokenGuardado);
          setUsuario(backendUsuario);
          void registrarPushToken(tokenGuardado);
        } else {
          // Token expirado o inválido — limpiamos.
          await borrarToken();
        }
      } catch {
        // Sin conexión: dejamos usuario como null para que pueda reintentar.
      } finally {
        setCargando(false);
      }
    };

    restaurarSesion();
  }, []);

  return (
    <AuthContext.Provider
      value={{ usuario, usuarioId: usuario?.id ?? null, token, cargando, sincronizar, cerrarSesion, refrescarUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
