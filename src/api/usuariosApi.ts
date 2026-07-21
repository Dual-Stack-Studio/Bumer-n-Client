import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bumeran-backend-production.up.railway.app';

const TOKEN_KEY = 'auth_token';

export interface UsuarioBackend {
  id: string;
  googleId: string;
  name: string | null;
  email: string;
  photo: string | null;
  telefono: string | null;
  telefonoVerificado: boolean;
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioBackend;
}

export async function guardarToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function obtenerToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function borrarToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export function getAuthHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function eliminarCuenta(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/usuarios/me`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'No se pudo eliminar la cuenta');
  }
}

export async function loginConGoogle(idToken: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Error al autenticar con Google: ${body}`);
  }

  return response.json();
}
