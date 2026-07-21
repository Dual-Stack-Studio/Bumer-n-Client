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
  expiraEn?: string;
  distancia?: number;
  telefonoContacto?: string;
  fotos?: string[];
  userId?: string;
  imagen?: string;
}