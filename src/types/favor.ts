export interface Favor {
  id: string;
  tipo: 'necesito' | 'ofrezco' | 'regalo';
  titulo: string;
  descripcion: string;
  categoria: string;
  ubicacion: {
    latitude: number;
    longitude: number;
  };
  estado: 'abierto' | 'en_proceso' | 'cerrado';
  creadoEn: string;
  distancia?: number;
}