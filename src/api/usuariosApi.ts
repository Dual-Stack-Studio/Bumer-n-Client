const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';

export interface UsuarioBackend {
  id: string;
  googleId: string;
  name: string | null;
  email: string;
  photo: string | null;
  telefono: string | null;
}

export interface SincronizarUsuarioInput {
  googleId: string;
  name?: string;
  email: string;
  photo?: string;
  telefono?: string;
}

export async function sincronizarUsuario(input: SincronizarUsuarioInput): Promise<UsuarioBackend> {
  const response = await fetch(`${API_URL}/api/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('No se pudo sincronizar el usuario');
  }

  return response.json();
}
