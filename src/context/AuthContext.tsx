import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  loginConGoogle,
  guardarToken,
  obtenerToken,
  borrarToken,
  UsuarioBackend,
} from '../api/usuariosApi';

interface AuthContextValue {
  usuario: UsuarioBackend | null;
  usuarioId: string | null;
  token: string | null;
  cargando: boolean;
  sincronizar: (idToken: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioBackend | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const sincronizar = useCallback(async (idToken: string) => {
    const { token: jwtToken, usuario: backendUsuario } = await loginConGoogle(idToken);
    await guardarToken(jwtToken);
    setToken(jwtToken);
    setUsuario(backendUsuario);
  }, []);

  const cerrarSesion = useCallback(async () => {
    await GoogleSignin.signOut();
    await borrarToken();
    setToken(null);
    setUsuario(null);
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
      value={{ usuario, usuarioId: usuario?.id ?? null, token, cargando, sincronizar, cerrarSesion }}
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
