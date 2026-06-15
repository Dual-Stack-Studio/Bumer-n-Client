// Lista única de categorías, compartida entre los filtros del mapa (CategoryPills)
// y el formulario de creación de publicaciones (PedirFavorScreen).
export interface Categoria {
  id: string;
  label: string;
  icon: string;
}

export const CATEGORIAS: Categoria[] = [
  { id: 'herramientas', label: 'Herramientas', icon: '🛠️' },
  { id: 'jardinería', label: 'Jardinería', icon: '🌱' },
  { id: 'mascotas', label: 'Mascotas', icon: '🐕' },
  { id: 'transporte', label: 'Transporte', icon: '🚗' },
  { id: 'mudanza', label: 'Mudanza', icon: '📦' },
  { id: 'idiomas', label: 'Idiomas', icon: '💬' },
  { id: 'limpieza', label: 'Limpieza', icon: '🧽' },
  { id: 'trámites', label: 'Trámites', icon: '📄' },
  { id: 'reparaciones', label: 'Reparaciones', icon: '🔧' },
  { id: 'ensamblaje', label: 'Ensamblaje', icon: '🪛' },
  { id: 'tecnología', label: 'Tecnología', icon: '💻' },
  { id: 'urgente', label: 'Urgente', icon: '🚨' },
  { id: 'otros', label: 'Otros', icon: '🎁' },
];
