import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { GoogleSignin, User as GoogleUser } from '@react-native-google-signin/google-signin';
import { sincronizarUsuario, UsuarioBackend } from '../api/usuariosApi';

interface AuthContextValue {
  googleUser: GoogleUser | null;
  usuario: UsuarioBackend | null;
  usuarioId: string | null;
  cargando: boolean;
  sincronizar: (googleUser: GoogleUser) => Promise<void>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [usuario, setUsuario] = useState<UsuarioBackend | null>(null);
  const [cargando, setCargando] = useState(true);

  const sincronizar = useCallback(async (user: GoogleUser) => {
    setGoogleUser(user);
    try {
      const backendUser = await sincronizarUsuario({
        googleId: user.user.id,
        name: user.user.name ?? undefined,
        email: user.user.email,
        photo: user.user.photo ?? undefined,
      });
      setUsuario(backendUser);
    } catch (error) {
      console.log('No se pudo sincronizar el usuario con el backend:', error);
      setUsuario(null);
    }
  }, []);

  const cerrarSesion = useCallback(() => {
    setGoogleUser(null);
    setUsuario(null);
  }, []);

  useEffect(() => {
    const usuarioActual = GoogleSignin.getCurrentUser();
    if (usuarioActual) {
      sincronizar(usuarioActual).finally(() => setCargando(false));
    } else {
      setCargando(false);
    }
  }, [sincronizar]);

  return (
    <AuthContext.Provider
      value={{ googleUser, usuario, usuarioId: usuario?.id ?? null, cargando, sincronizar, cerrarSesion }}
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
