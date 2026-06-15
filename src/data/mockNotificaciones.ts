import type { Translation } from '../i18n/translations';

export interface Notificacion {
  id: string;
  icono: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  leida: boolean;
}

export function getMockNotificaciones(t: Translation): Notificacion[] {
  return [
    {
      id: '1',
      icono: '💬',
      titulo: t.notifications.n1Titulo,
      descripcion: t.notifications.n1Desc,
      fecha: t.notifications.n1Fecha,
      leida: false,
    },
    {
      id: '2',
      icono: '⏳',
      titulo: t.notifications.n2Titulo,
      descripcion: t.notifications.n2Desc,
      fecha: t.notifications.n2Fecha,
      leida: false,
    },
    {
      id: '3',
      icono: '✅',
      titulo: t.notifications.n3Titulo,
      descripcion: t.notifications.n3Desc,
      fecha: t.notifications.n3Fecha,
      leida: true,
    },
    {
      id: '4',
      icono: '⭐',
      titulo: t.notifications.n4Titulo,
      descripcion: t.notifications.n4Desc,
      fecha: t.notifications.n4Fecha,
      leida: true,
    },
  ];
}
