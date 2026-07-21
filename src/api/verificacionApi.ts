const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bumeran-backend-production.up.railway.app';

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

export interface EstadoVerificacion {
  telefono: string | null;
  telefonoVerificado: boolean;
  telefonoVerificadoEn: string | null;
}

export function enviarCodigo(
  telefono: string,
  token: string,
): Promise<{ mensaje: string; codigo?: string }> {
  return req('/verificacion/enviar', 'POST', token, { telefono });
}

export function confirmarCodigo(
  codigo: string,
  token: string,
): Promise<{ verificado: boolean }> {
  return req('/verificacion/confirmar', 'POST', token, { codigo });
}

export function getEstadoVerificacion(token: string): Promise<EstadoVerificacion> {
  return req('/verificacion/estado', 'GET', token);
}
