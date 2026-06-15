import { Favor } from '../types/favor';
import type { Language } from '../i18n/translations';

// Datos base (sin título/descripción) compartidos entre idiomas.
// La categoría se mantiene en español porque es el valor canónico
// usado para filtrar (coincide con los ids de CATEGORIAS).
const BASE = [
  {
    id: 'a1b2c3d4-0001-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Herramientas',
    ubicacion: { latitude: 48.1121, longitude: 14.5652 },
    estado: 'abierto',
    creadoEn: '2026-06-01T09:15:00Z',
  },
  {
    id: 'a1b2c3d4-0002-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Jardinería',
    ubicacion: { latitude: 48.1145, longitude: 14.5583 },
    estado: 'abierto',
    creadoEn: '2026-06-02T14:20:00Z',
  },
  {
    id: 'a1b2c3d4-0003-4000-abcd-ef1234567890',
    tipo: 'ofrezco',
    categoria: 'Herramientas',
    ubicacion: { latitude: 48.1098, longitude: 14.5694 },
    estado: 'abierto',
    creadoEn: '2026-06-02T16:45:00Z',
  },
  {
    id: 'a1b2c3d4-0004-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Idiomas',
    ubicacion: { latitude: 48.1132, longitude: 14.5637 },
    estado: 'abierto',
    creadoEn: '2026-06-03T11:00:00Z',
  },
  {
    id: 'a1b2c3d4-0005-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Mudanza',
    ubicacion: { latitude: 48.1168, longitude: 14.5611 },
    estado: 'abierto',
    creadoEn: '2026-06-03T18:30:00Z',
  },
  {
    id: 'a1b2c3d4-0006-4000-abcd-ef1234567890',
    tipo: 'ofrezco',
    categoria: 'Mascotas',
    ubicacion: { latitude: 48.1182, longitude: 14.5524 },
    estado: 'abierto',
    creadoEn: '2026-06-04T08:00:00Z',
  },
  {
    id: 'a1b2c3d4-0007-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Herramientas',
    ubicacion: { latitude: 48.1054, longitude: 14.5689 },
    estado: 'abierto',
    creadoEn: '2026-06-04T12:10:00Z',
  },
  {
    id: 'a1b2c3d4-0008-4000-abcd-ef1234567890',
    tipo: 'ofrezco',
    categoria: 'Transporte',
    ubicacion: { latitude: 48.1251, longitude: 14.5595 },
    estado: 'abierto',
    creadoEn: '2026-06-05T07:45:00Z',
  },
  {
    id: 'a1b2c3d4-0009-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Limpieza',
    ubicacion: { latitude: 48.1115, longitude: 14.5561 },
    estado: 'abierto',
    creadoEn: '2026-06-05T15:20:00Z',
  },
  {
    id: 'a1b2c3d4-0010-4000-abcd-ef1234567890',
    tipo: 'regalo',
    categoria: 'Otros',
    ubicacion: { latitude: 48.1159, longitude: 14.5678 },
    estado: 'abierto',
    creadoEn: '2026-06-06T10:00:00Z',
  },
] as const;

// Título y descripción por idioma, en el mismo orden que BASE.
const CONTENIDO: Record<Language, { titulo: string; descripcion: string }[]> = {
  es: [
    {
      titulo: 'Taladro percutor',
      descripcion: 'Necesito colgar unos estantes pesados en la pared del living. ¿Alguien me podría prestar un taladro fuerte por una tarde?',
    },
    {
      titulo: 'Cuidado de plantas',
      descripcion: 'Me voy de viaje el próximo fin de semana. ¿Algún vecino amable podría pasar a regar las plantas del jardín un par de veces?',
    },
    {
      titulo: 'Cortadora de césped',
      descripcion: 'Ofrezco mi cortadora de césped a nafta para el fin de semana si alguien la necesita para limpiar su jardín. La puedo alcanzar en auto.',
    },
    {
      titulo: 'Práctica de Alemán (A1/A2)',
      descripcion: 'Estoy estudiando alemán y busco un hablante nativo para tomar un café en el centro y practicar conversación básica. ¡Yo invito el café!',
    },
    {
      titulo: 'Ayuda con mudanza',
      descripcion: 'Tengo que mover un sofá y una mesa grande hasta un segundo piso este viernes por la tarde. Necesito una mano fuerte para cargar.',
    },
    {
      titulo: 'Paseo de perros',
      descripcion: 'Trabajo desde casa y suelo salir a caminar por la zona del Tierpark todas las mañanas. Puedo llevar a pasear al perro de algún vecino.',
    },
    {
      titulo: 'Escalera alta de aluminio',
      descripcion: 'Necesito cambiar unas luces dicroicas en un techo doble altura y no llego. ¿Alguien tiene una escalera telescópica de más de 3 metros?',
    },
    {
      titulo: 'Compartir viaje a Linz',
      descripcion: 'Viajo todos los martes y jueves temprano a Linz por trabajo y tengo 3 lugares libres en el auto. Salgo desde la zona de la estación.',
    },
    {
      titulo: 'Hidrolavadora',
      descripcion: 'Quiero limpiar a fondo las baldosas del patio exterior que juntaron musgo. Busco una hidrolavadora (Kärcher o similar) prestada por un día.',
    },
    {
      titulo: 'Donación de cajas de cartón',
      descripcion: 'Terminé de desarmar los bultos de mi mudanza y tengo unas 15 cajas de cartón grandes y firmes en excelente estado si a alguien le sirven.',
    },
  ],
  en: [
    {
      titulo: 'Hammer drill',
      descripcion: "I need to hang some heavy shelves on the living room wall. Could someone lend me a powerful drill for an afternoon?",
    },
    {
      titulo: 'Plant care',
      descripcion: "I'm going on a trip next weekend. Could a kind neighbor stop by to water the garden plants a couple of times?",
    },
    {
      titulo: 'Lawn mower',
      descripcion: "I'm offering my gas lawn mower for the weekend if anyone needs it to tidy up their garden. I can drop it off by car.",
    },
    {
      titulo: 'German practice (A1/A2)',
      descripcion: "I'm studying German and looking for a native speaker to grab a coffee downtown and practice basic conversation. Coffee's on me!",
    },
    {
      titulo: 'Help with a move',
      descripcion: 'I need to move a sofa and a large table up to the second floor this Friday afternoon. I need a strong pair of hands to help carry.',
    },
    {
      titulo: 'Dog walking',
      descripcion: 'I work from home and usually go for a walk around the Tierpark area every morning. I can take a neighbor\'s dog along for a walk.',
    },
    {
      titulo: 'Tall aluminum ladder',
      descripcion: "I need to change some spotlights on a double-height ceiling and can't reach. Does anyone have a telescopic ladder over 3 meters?",
    },
    {
      titulo: 'Carpool to Linz',
      descripcion: 'I drive to Linz for work early every Tuesday and Thursday and have 3 free seats in the car. I leave from near the station.',
    },
    {
      titulo: 'Pressure washer',
      descripcion: 'I want to deep clean the outdoor patio tiles that have gathered moss. Looking to borrow a pressure washer (Kärcher or similar) for a day.',
    },
    {
      titulo: 'Cardboard boxes to give away',
      descripcion: 'I just finished unpacking from my move and have about 15 large, sturdy cardboard boxes in great condition if anyone can use them.',
    },
  ],
  de: [
    {
      titulo: 'Schlagbohrmaschine',
      descripcion: 'Ich muss ein paar schwere Regale an der Wohnzimmerwand aufhängen. Könnte mir jemand für einen Nachmittag einen kräftigen Bohrer leihen?',
    },
    {
      titulo: 'Pflanzenpflege',
      descripcion: 'Ich fahre nächstes Wochenende weg. Könnte ein netter Nachbar ein paar Mal vorbeikommen, um die Gartenpflanzen zu gießen?',
    },
    {
      titulo: 'Rasenmäher',
      descripcion: 'Ich biete meinen Benzin-Rasenmäher für das Wochenende an, falls jemand ihn braucht, um den Garten zu pflegen. Ich kann ihn mit dem Auto vorbeibringen.',
    },
    {
      titulo: 'Deutsch üben (A1/A2)',
      descripcion: 'Ich lerne Deutsch und suche einen Muttersprachler, um in der Stadt einen Kaffee zu trinken und einfache Gespräche zu üben. Der Kaffee geht auf mich!',
    },
    {
      titulo: 'Hilfe beim Umzug',
      descripcion: 'Ich muss am Freitagnachmittag ein Sofa und einen großen Tisch in den zweiten Stock bringen. Ich brauche kräftige Hände zum Tragen.',
    },
    {
      titulo: 'Hundespaziergang',
      descripcion: 'Ich arbeite von zu Hause aus und gehe jeden Morgen rund um den Tierpark spazieren. Ich kann gerne den Hund eines Nachbarn mitnehmen.',
    },
    {
      titulo: 'Hohe Aluminiumleiter',
      descripcion: 'Ich muss ein paar Einbaustrahler an einer doppelt hohen Decke wechseln und komme nicht hin. Hat jemand eine Teleskopleiter über 3 Meter?',
    },
    {
      titulo: 'Mitfahrgelegenheit nach Linz',
      descripcion: 'Ich fahre jeden Dienstag und Donnerstag früh aus beruflichen Gründen nach Linz und habe 3 freie Plätze im Auto. Ich starte in der Nähe des Bahnhofs.',
    },
    {
      titulo: 'Hochdruckreiniger',
      descripcion: 'Ich möchte die Terrassenfliesen, auf denen sich Moos gebildet hat, gründlich reinigen. Ich suche einen Hochdruckreiniger (Kärcher o.ä.) für einen Tag zum Ausleihen.',
    },
    {
      titulo: 'Kartons zu verschenken',
      descripcion: 'Ich habe meinen Umzug ausgepackt und habe etwa 15 große, stabile Kartons in sehr gutem Zustand übrig, falls jemand sie brauchen kann.',
    },
  ],
};

export function getMockFavores(language: Language): Favor[] {
  const contenido = CONTENIDO[language] ?? CONTENIDO.es;
  return BASE.map((base, index) => ({
    ...base,
    ...contenido[index],
  })) as Favor[];
}
