import { Favor } from '../types/favor';
import { getMockFavores } from '../data/mockFavores';
import type { Language } from '../i18n/translations';

// En el emulador de Android, 10.0.2.2 apunta al localhost de la máquina anfitriona.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';

export interface NuevoFavorInput {
  tipo: Favor['tipo'];
  titulo: string;
  descripcion: string;
  categoria: string;
  ubicacion: {
    latitude: number;
    longitude: number;
  };
  expiraEn?: string;
  telefonoContacto?: string;
  userId?: string;
}

export interface ActualizarFavorInput {
  tipo?: Favor['tipo'];
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  ubicacion?: {
    latitude: number;
    longitude: number;
  };
  estado?: Favor['estado'];
  expiraEn?: string;
  telefonoContacto?: string;
}

export async function getFavores(language: Language = 'es', userId?: string): Promise<Favor[]> {
  try {
    const url = userId
      ? `${API_URL}/api/favores?userId=${encodeURIComponent(userId)}`
      : `${API_URL}/api/favores`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('No se pudieron cargar los favores');
    }

    return response.json();
  } catch (error) {
    console.log('No se pudo conectar con el backend, usando datos de ejemplo:', error);
    return getMockFavores(language);
  }
}

export async function crearFavor(input: NuevoFavorInput): Promise<Favor> {
  const response = await fetch(`${API_URL}/api/favores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('No se pudo publicar el favor');
  }

  return response.json();
}

export async function actualizarFavor(id: string, input: ActualizarFavorInput): Promise<Favor> {
  const response = await fetch(`${API_URL}/api/favores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar el favor');
  }

  return response.json();
}

export async function eliminarFavor(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/favores/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar el favor');
  }
}
