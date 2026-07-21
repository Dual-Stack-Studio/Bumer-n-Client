import { Review } from '../types/review';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bumeran-backend-production.up.railway.app';

export interface CreateReviewInput {
  favorId: string;
  destinatarioId: string;
  estrellas: number;
  comentario?: string;
}

export async function crearReview(input: CreateReviewInput, token: string): Promise<Review> {
  const res = await fetch(`${API_URL}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'No se pudo guardar la reseña');
  }
  return res.json();
}

export async function getReviewsDeUsuario(userId: string): Promise<Review[]> {
  const res = await fetch(`${API_URL}/api/reviews/usuario/${userId}`);
  if (!res.ok) throw new Error('No se pudieron cargar las reseñas');
  return res.json();
}
