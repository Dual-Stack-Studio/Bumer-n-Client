const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bumeran-backend-production.up.railway.app';

export interface Notificacion {
  id: string;
  tipo: string;
  titulo: string;
  cuerpo: string;
  leida: boolean;
  payload: { favorId?: string; conexionId?: string } | null;
  creadoEn: string;
}

export async function getMisNotificaciones(token: string): Promise<Notificacion[]> {
  const res = await fetch(`${API_URL}/api/notificaciones`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener notificaciones');
  return res.json();
}

export async function marcarLeida(id: string, token: string): Promise<void> {
  await fetch(`${API_URL}/api/notificaciones/${id}/leer`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function marcarTodasLeidas(token: string): Promise<void> {
  await fetch(`${API_URL}/api/notificaciones/leer-todas`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function guardarPushToken(pushToken: string, token: string): Promise<void> {
  await fetch(`${API_URL}/api/usuarios/push-token`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ token: pushToken }),
  });
}
