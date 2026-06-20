import { Review } from '../types/review';

export const mockReviews: Review[] = [
  {
    id: 'r1',
    favorId: 'mock-1',
    favorTitulo: 'Préstamo de taladro',
    autorNombre: 'María González',
    estrellas: 5,
    comentario: 'Muy amable y puntual. El taladro estaba en perfecto estado. ¡Totalmente recomendado!',
    creadoEn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r2',
    favorId: 'mock-2',
    favorTitulo: 'Ayuda con mudanza',
    autorNombre: 'Carlos Ramírez',
    estrellas: 4,
    comentario: 'Gran ayuda, llegó a tiempo y fue muy eficiente. Lo volvería a contactar.',
    creadoEn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r3',
    favorId: 'mock-3',
    favorTitulo: 'Clases de inglés',
    autorNombre: 'Ana Pérez',
    estrellas: 5,
    comentario: 'Excelente, muy paciente y claro en sus explicaciones. Aprendí muchísimo.',
    creadoEn: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
