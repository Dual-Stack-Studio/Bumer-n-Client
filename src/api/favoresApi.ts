import { Favor } from '../types/favor';
import type { Language } from '../i18n/translations';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bumeran-backend-production.up.railway.app';

export interface NuevoFavorInput {
  tipo: Favor['tipo'];
  titulo: string;
  descripcion: string;
  categoria: string;
  latitude: number;
  longitude: number;
  expiraEn?: string;
  telefonoContacto?: string;
}

export interface ActualizarFavorInput {
  tipo?: Favor['tipo'];
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  latitude?: number;
  longitude?: number;
  estado?: Favor['estado'];
  expiraEn?: string;
  telefonoContacto?: string;
}

export async function getFavores(_language: Language = 'es'): Promise<Favor[]> {
  const response = await fetch(`${API_URL}/api/favores`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los favores');
  }

  const data = await response.json();
  // El backend devuelve latitude/longitude sueltos; el tipo Favor usa ubicacion: { latitude, longitude }
  return data.map((f: any) => ({
    ...f,
    ubicacion: f.ubicacion ?? { latitude: f.latitude, longitude: f.longitude },
  }));
}

export async function crearFavor(input: NuevoFavorInput, token: string): Promise<Favor> {
  const response = await fetch(`${API_URL}/api/favores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'No se pudo publicar el favor');
  }

  return response.json();
}

export async function actualizarFavor(id: string, input: ActualizarFavorInput, token: string): Promise<Favor> {
  const response = await fetch(`${API_URL}/api/favores/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'No se pudo actualizar el favor');
  }

  return response.json();
}

export async function eliminarFavor(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/favores/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'No se pudo eliminar el favor');
  }
}
