const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bumeran-backend-production.up.railway.app';

export type EstadoConexion = 'pendiente' | 'aceptada' | 'completada' | 'cancelada';

export interface Conexion {
  id: string;
  favorId: string;
  solicitanteId: string;
  ayudanteId: string;
  estado: EstadoConexion;
  creadoEn: string;
  favor?: { id: string; titulo: string; tipo: string; estado: string };
  solicitante?: { id: string; name: string; photo: string | null };
  ayudante?: { id: string; name: string; photo: string | null; telefonoVerificado: boolean };
}

async function req<T>(path: string, method: string, token: string, body?: object): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Error ${res.status}`);
  }
  return res.json();
}

export function crearConexion(favorId: string, token: string): Promise<Conexion> {
  return req('/conexiones', 'POST', token, { favorId });
}

export function aceptarConexion(id: string, token: string): Promise<Conexion> {
  return req(`/conexiones/${id}/aceptar`, 'PATCH', token);
}

export function completarConexion(id: string, token: string): Promise<Conexion> {
  return req(`/conexiones/${id}/completar`, 'PATCH', token);
}

export function cancelarConexion(id: string, token: string): Promise<Conexion> {
  return req(`/conexiones/${id}/cancelar`, 'PATCH', token);
}

export function getConexionesFavor(favorId: string, token: string): Promise<Conexion[]> {
  return req(`/conexiones/favor/${favorId}`, 'GET', token);
}

export function getMisConexiones(token: string): Promise<Conexion[]> {
  return req('/conexiones/mis', 'GET', token);
}
