import { Favor } from '../types/favor';
import { formatMessage } from '../i18n/format';
import type { Translation } from '../i18n/translations';

// Genera el link de WhatsApp con un mensaje prearmado para contactar
// al autor de la publicación. Si no hay teléfono, abre el selector de
// contactos de WhatsApp con el mensaje ya cargado.
export function getWhatsappUrl(favor: Pick<Favor, 'titulo' | 'telefonoContacto'>): string {
  const mensaje = `Hola, vi tu publicación en Cadena de Favores sobre "${favor.titulo}". ¿Sigue disponible?`;
  const telefono = favor.telefonoContacto?.replace(/[^\d]/g, '');

  const base = telefono ? `https://wa.me/${telefono}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(mensaje)}`;
}

// Duración por defecto para publicaciones que todavía no traen "expiraEn"
// desde el backend (mientras se agrega ese campo del lado del servidor).
const EXPIRACION_POR_DEFECTO_HORAS = 24 * 7; // 7 días

type FavorParaEstado = Pick<Favor, 'estado' | 'creadoEn' | 'expiraEn'>;

export function getEstadoBadge(favor: FavorParaEstado, t: Translation) {
  const estadoBadges: Record<Favor['estado'], { label: string; bg: string; text: string }> = {
    abierto: { label: t.favorHelpers.estadoActiva, bg: '#f0fdf4', text: '#15803d' },
    en_proceso: { label: t.favorHelpers.estadoEnProceso, bg: '#fffbeb', text: '#b45309' },
    cerrado: { label: t.favorHelpers.estadoCompletada, bg: '#f1f5f9', text: '#475569' },
  };
  const expiradaBadge = { label: t.favorHelpers.estadoExpirada, bg: '#f1f5f9', text: '#94a3b8' };

  if (favor.estado === 'abierto' && estaExpirado(favor)) {
    return expiradaBadge;
  }

  return estadoBadges[favor.estado] ?? estadoBadges.abierto;
}

function calcularFechaExpiracion(favor: Pick<Favor, 'creadoEn' | 'expiraEn'>) {
  if (favor.expiraEn) return new Date(favor.expiraEn);

  const creado = new Date(favor.creadoEn);
  return new Date(creado.getTime() + EXPIRACION_POR_DEFECTO_HORAS * 60 * 60 * 1000);
}

function estaExpirado(favor: Pick<Favor, 'creadoEn' | 'expiraEn'>): boolean {
  return calcularFechaExpiracion(favor).getTime() - Date.now() <= 0;
}

export function getTiempoRestante(favor: Pick<Favor, 'creadoEn' | 'expiraEn'>, t: Translation): string {
  const ahora = new Date();
  const expira = calcularFechaExpiracion(favor);
  const diffMs = expira.getTime() - ahora.getTime();

  if (diffMs <= 0) return t.favorHelpers.expirado;

  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHoras < 1) {
    const diffMin = Math.floor(diffMs / (1000 * 60));
    return formatMessage(t.favorHelpers.expiraEnMin, { min: diffMin });
  }
  if (diffHoras < 24) {
    return formatMessage(t.favorHelpers.expiraEnHoras, { horas: diffHoras });
  }
  const diffDias = Math.floor(diffHoras / 24);
  return formatMessage(diffDias === 1 ? t.favorHelpers.expiraEnDia : t.favorHelpers.expiraEnDias, { dias: diffDias });
}

// Opciones de duración para el formulario de creación.
export function getOpcionesExpiracion(t: Translation) {
  return [
    { label: t.favorHelpers.opcion24h, horas: 24 },
    { label: t.favorHelpers.opcion48h, horas: 48 },
    { label: t.favorHelpers.opcion7dias, horas: 24 * 7 },
    { label: t.favorHelpers.opcion30dias, horas: 24 * 30 },
  ];
}
