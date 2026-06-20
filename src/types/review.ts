export interface Review {
  id: string;
  favorId: string;
  favorTitulo: string;
  autorNombre: string;
  autorFoto?: string;
  estrellas: number;
  comentario: string;
  creadoEn: string;
}
