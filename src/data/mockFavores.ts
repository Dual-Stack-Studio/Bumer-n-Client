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
  // Barcelona
  {
    id: 'a1b2c3d4-0011-4000-abcd-ef1234567890',
    tipo: 'ofrezco',
    categoria: 'Idiomas',
    ubicacion: { latitude: 41.4145, longitude: 2.1527 },
    estado: 'abierto',
    creadoEn: '2026-06-07T09:00:00Z',
  },
  {
    id: 'a1b2c3d4-0012-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Mudanza',
    ubicacion: { latitude: 41.4036, longitude: 2.1744 },
    estado: 'abierto',
    creadoEn: '2026-06-07T12:30:00Z',
  },
  {
    id: 'a1b2c3d4-0013-4000-abcd-ef1234567890',
    tipo: 'ofrezco',
    categoria: 'Transporte',
    ubicacion: { latitude: 41.3784, longitude: 2.1925 },
    estado: 'abierto',
    creadoEn: '2026-06-08T08:15:00Z',
  },
  {
    id: 'a1b2c3d4-0014-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Reparaciones',
    ubicacion: { latitude: 41.4072, longitude: 2.1563 },
    estado: 'abierto',
    creadoEn: '2026-06-08T17:45:00Z',
  },
  {
    id: 'a1b2c3d4-0015-4000-abcd-ef1234567890',
    tipo: 'regalo',
    categoria: 'Otros',
    ubicacion: { latitude: 41.3733, longitude: 2.1620 },
    estado: 'abierto',
    creadoEn: '2026-06-09T10:20:00Z',
  },
  {
    id: 'a1b2c3d4-0016-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Mascotas',
    ubicacion: { latitude: 41.3757, longitude: 2.1330 },
    estado: 'abierto',
    creadoEn: '2026-06-09T19:00:00Z',
  },
  {
    id: 'a1b2c3d4-0017-4000-abcd-ef1234567890',
    tipo: 'ofrezco',
    categoria: 'Tecnología',
    ubicacion: { latitude: 41.3989, longitude: 2.1994 },
    estado: 'abierto',
    creadoEn: '2026-06-10T11:10:00Z',
  },
  {
    id: 'a1b2c3d4-0018-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Trámites',
    ubicacion: { latitude: 41.3917, longitude: 2.1649 },
    estado: 'abierto',
    creadoEn: '2026-06-10T15:40:00Z',
  },
  // Torredembarra
  {
    id: 'a1b2c3d4-0019-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Jardinería',
    ubicacion: { latitude: 41.1463, longitude: 1.4022 },
    estado: 'abierto',
    creadoEn: '2026-06-11T08:30:00Z',
  },
  {
    id: 'a1b2c3d4-0020-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Limpieza',
    ubicacion: { latitude: 41.1432, longitude: 1.4067 },
    estado: 'abierto',
    creadoEn: '2026-06-11T16:00:00Z',
  },
  {
    id: 'a1b2c3d4-0021-4000-abcd-ef1234567890',
    tipo: 'ofrezco',
    categoria: 'Herramientas',
    ubicacion: { latitude: 41.1502, longitude: 1.3958 },
    estado: 'abierto',
    creadoEn: '2026-06-12T09:50:00Z',
  },
  {
    id: 'a1b2c3d4-0022-4000-abcd-ef1234567890',
    tipo: 'ofrezco',
    categoria: 'Transporte',
    ubicacion: { latitude: 41.1488, longitude: 1.4001 },
    estado: 'abierto',
    creadoEn: '2026-06-12T07:00:00Z',
  },
  {
    id: 'a1b2c3d4-0023-4000-abcd-ef1234567890',
    tipo: 'regalo',
    categoria: 'Otros',
    ubicacion: { latitude: 41.1450, longitude: 1.4045 },
    estado: 'abierto',
    creadoEn: '2026-06-13T13:15:00Z',
  },
  // Sant Jordi (Torredembarra)
  {
    id: 'a1b2c3d4-0024-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Ensamblaje',
    ubicacion: { latitude: 41.1495, longitude: 1.4275 },
    estado: 'abierto',
    creadoEn: '2026-06-13T18:00:00Z',
  },
  {
    id: 'a1b2c3d4-0025-4000-abcd-ef1234567890',
    tipo: 'ofrezco',
    categoria: 'Idiomas',
    ubicacion: { latitude: 41.1510, longitude: 1.4300 },
    estado: 'abierto',
    creadoEn: '2026-06-14T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0026-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Urgente',
    ubicacion: { latitude: 41.1480, longitude: 1.4250 },
    estado: 'abierto',
    creadoEn: '2026-06-14T20:30:00Z',
  },
  {
    id: 'a1b2c3d4-0027-4000-abcd-ef1234567890',
    tipo: 'ofrezco',
    categoria: 'Mascotas',
    ubicacion: { latitude: 41.1525, longitude: 1.4330 },
    estado: 'abierto',
    creadoEn: '2026-06-15T07:30:00Z',
  },
  {
    id: 'a1b2c3d4-0028-4000-abcd-ef1234567890',
    tipo: 'necesito',
    categoria: 'Jardinería',
    ubicacion: { latitude: 41.1505, longitude: 1.4290 },
    estado: 'abierto',
    creadoEn: '2026-06-15T09:45:00Z',
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
    {
      titulo: 'Intercambio de idiomas cerca de Park Güell',
      descripcion: 'Vivo cerca de Park Güell y busco intercambio de idiomas: te ayudo con catalán o español y tú me ayudas a practicar inglés o italiano un par de tardes por semana.',
    },
    {
      titulo: 'Ayuda para bajar muebles (Sagrada Família)',
      descripcion: 'Me mudo de un piso sin ascensor cerca de la Sagrada Família y necesito ayuda para bajar una cómoda y varias cajas pesadas el sábado por la mañana.',
    },
    {
      titulo: 'Lugar libre en el coche hacia Barceloneta',
      descripcion: 'Tengo coche y voy seguido a Barceloneta los fines de semana. Si alguien necesita acercarse a la playa o al puerto, tengo un lugar libre.',
    },
    {
      titulo: 'Persiana atascada en Gràcia',
      descripcion: 'Se me trabó la persiana de un dormitorio en Gràcia y no puedo bajarla del todo. Busco a alguien con experiencia en reparaciones para revisarla.',
    },
    {
      titulo: 'Plantas y macetas para regalar (Poble Sec)',
      descripcion: 'Estoy reduciendo mi balcón y tengo varias plantas grandes en maceta (potos, lengua de suegra, etc.) para quien quiera venir a buscarlas en Poble Sec.',
    },
    {
      titulo: 'Cuidado de gato en Sants',
      descripcion: 'Me voy unos días y necesito que alguien le dé de comer a mi gato y le cambie el arenero en Sants, una vez al día.',
    },
    {
      titulo: 'Router y cables de red para regalar (Poblenou)',
      descripcion: 'Cambié de operador y me quedó un router viejo funcionando perfecto, más varios cables de red. Lo regalo a quien lo necesite en Poblenou.',
    },
    {
      titulo: 'Ayuda con el papeleo del padrón (Eixample)',
      descripcion: 'Necesito ayuda para entender el formulario de empadronamiento en el Eixample, no es mi idioma materno y me cuesta completarlo bien.',
    },
    {
      titulo: 'Préstamo de carretilla (Torredembarra centro)',
      descripcion: 'Estoy renovando el jardín y necesito mover tierra y piedras. ¿Alguien tiene una carretilla para prestar un par de días en Torredembarra centro?',
    },
    {
      titulo: 'Limpieza de portal después del verano',
      descripcion: 'Vivo cerca de la playa de Torredembarra y después del verano queda mucha arena en la entrada del edificio. Busco ayuda para una limpieza a fondo del portal.',
    },
    {
      titulo: 'Presto bordeadora a motor (Vilafortuny)',
      descripcion: 'Tengo una bordeadora a motor en buen estado y la presto los fines de semana para quien tenga que arreglar el jardín por la zona de Vilafortuny.',
    },
    {
      titulo: 'Viaje compartido a la estación de Torredembarra',
      descripcion: 'Salgo casi todos los días hacia la estación de Renfe de Torredembarra a primera hora. Tengo lugar para una persona más si vas en la misma dirección.',
    },
    {
      titulo: 'Cajas y material de mudanza para regalar',
      descripcion: 'Terminé una mudanza en el centro de Torredembarra y me quedaron cajas, papel burbuja y bolsas grandes en buen estado, las regalo.',
    },
    {
      titulo: 'Ayuda para montar muebles de Ikea (Sant Jordi)',
      descripcion: 'Compré un armario y una cama de Ikea para la casa de Sant Jordi y no tengo herramientas ni mucha idea. ¿Alguien con experiencia me puede ayudar a montarlos?',
    },
    {
      titulo: 'Práctica de inglés en Sant Jordi',
      descripcion: 'Vivo en Sant Jordi d\'Alfama y quiero practicar inglés conversacional. A cambio ofrezco ayuda con el español o catalán, podemos quedar en alguna terraza del pueblo.',
    },
    {
      titulo: 'Urgente: corte de luz, necesito un electricista',
      descripcion: 'Se cortó la luz en toda la casa en Sant Jordi y no logro resetear el diferencial. Es urgente porque tengo el freezer lleno, ¿alguien con conocimientos de electricidad cerca?',
    },
    {
      titulo: 'Cuido mascotas en Sant Jordi',
      descripcion: 'Si te vas de viaje y necesitas que alguien le dé de comer o pasee a tu perro o gato en la zona de Sant Jordi d\'Alfama, puedo ayudarte, tengo experiencia con animales.',
    },
    {
      titulo: 'Ayuda para podar un seto alto (Sant Jordi)',
      descripcion: 'Tengo un seto bastante alto en el jardín de mi casa en Sant Jordi y no llego ni tengo la herramienta adecuada. Busco una mano para podarlo.',
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
    {
      titulo: 'Language exchange near Park Güell',
      descripcion: "I live near Park Güell and I'm looking for a language exchange: I help you with Catalan or Spanish and you help me practice English or Italian a couple of afternoons a week.",
    },
    {
      titulo: 'Help carrying furniture down (Sagrada Família)',
      descripcion: "I'm moving out of a walk-up flat near Sagrada Família and need help carrying a dresser and several heavy boxes down on Saturday morning.",
    },
    {
      titulo: 'Free seat in the car to Barceloneta',
      descripcion: 'I have a car and go to Barceloneta most weekends. If anyone needs a ride to the beach or the port, I have a free seat.',
    },
    {
      titulo: 'Stuck roller blind in Gràcia',
      descripcion: 'The roller blind in a bedroom in Gràcia got stuck halfway down. Looking for someone handy with repairs to take a look.',
    },
    {
      titulo: 'Plants and pots to give away (Poble Sec)',
      descripcion: 'Downsizing my balcony and have several large potted plants (pothos, snake plant, etc.) free to whoever can pick them up in Poble Sec.',
    },
    {
      titulo: 'Cat feeding in Sants',
      descripcion: "I'm away for a few days and need someone to feed my cat and change the litter box in Sants once a day.",
    },
    {
      titulo: 'Old router and network cables to give away (Poblenou)',
      descripcion: 'Switched providers and have a working spare router plus several network cables. Free to anyone who needs them in Poblenou.',
    },
    {
      titulo: 'Help with residency registration (Eixample)',
      descripcion: "I need help understanding the padrón (residency registration) form in Eixample, it's not my native language and I'm struggling to fill it in correctly.",
    },
    {
      titulo: 'Wheelbarrow to borrow (central Torredembarra)',
      descripcion: 'Redoing my garden and need to move soil and stones. Does anyone have a wheelbarrow to lend for a couple of days in central Torredembarra?',
    },
    {
      titulo: 'Post-beach building entrance cleanup',
      descripcion: "I live near Torredembarra beach and after summer there's a lot of sand piling up at the building entrance. Looking for help with a deep clean of the hallway.",
    },
    {
      titulo: 'Lending a motor edge trimmer (Vilafortuny)',
      descripcion: 'I have a working motor edge trimmer and can lend it on weekends to anyone tidying up their garden around Vilafortuny.',
    },
    {
      titulo: 'Carpool to Torredembarra train station',
      descripcion: 'I drive to the Torredembarra Renfe station almost every morning early. I have room for one more person heading the same way.',
    },
    {
      titulo: 'Free moving boxes and packing material',
      descripcion: 'Just finished a move in central Torredembarra and have leftover boxes, bubble wrap and large bags in good condition, free to whoever wants them.',
    },
    {
      titulo: 'Help assembling Ikea furniture (Sant Jordi)',
      descripcion: "Bought a wardrobe and a bed from Ikea for the house in Sant Jordi and don't have the tools or much know-how. Can anyone with experience help assemble them?",
    },
    {
      titulo: 'English practice in Sant Jordi',
      descripcion: "I live in Sant Jordi d'Alfama and want to practice conversational English. In exchange I can help with Spanish or Catalan, we could meet at a terrace in the village.",
    },
    {
      titulo: 'Urgent: power cut, need an electrician',
      descripcion: "The power went out across the whole house in Sant Jordi and I can't reset the breaker. It's urgent since my freezer is full — anyone nearby with electrical know-how?",
    },
    {
      titulo: 'Pet sitting in Sant Jordi',
      descripcion: "If you're traveling and need someone to feed or walk your dog or cat around Sant Jordi d'Alfama, I can help, I have experience with animals.",
    },
    {
      titulo: 'Need help trimming a tall hedge (Sant Jordi)',
      descripcion: "I have a fairly tall hedge in my garden in Sant Jordi and can't reach it or have the right tools. Looking for a hand to trim it.",
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
    {
      titulo: 'Sprachtandem in der Nähe des Park Güell',
      descripcion: 'Ich wohne in der Nähe des Park Güell und suche ein Sprachtandem: Ich helfe dir mit Katalanisch oder Spanisch, und du hilfst mir, Englisch oder Italienisch zu üben, ein paar Nachmittage pro Woche.',
    },
    {
      titulo: 'Hilfe beim Möbeltransport (Sagrada Família)',
      descripcion: 'Ich ziehe aus einer Wohnung ohne Aufzug in der Nähe der Sagrada Família aus und brauche am Samstagvormittag Hilfe, eine Kommode und mehrere schwere Kartons hinunterzutragen.',
    },
    {
      titulo: 'Freier Platz im Auto nach Barceloneta',
      descripcion: 'Ich habe ein Auto und fahre fast jedes Wochenende nach Barceloneta. Wenn jemand zum Strand oder Hafen mitfahren möchte, habe ich einen freien Platz.',
    },
    {
      titulo: 'Klemmendes Rollo in Gràcia',
      descripcion: 'Das Rollo in einem Schlafzimmer in Gràcia klemmt auf halber Höhe. Ich suche jemanden mit Reparaturerfahrung, der sich das ansieht.',
    },
    {
      titulo: 'Pflanzen und Töpfe zu verschenken (Poble Sec)',
      descripcion: 'Ich verkleinere meinen Balkon und habe mehrere große Topfpflanzen (Efeutute, Bogenhanf usw.) abzugeben, abzuholen in Poble Sec.',
    },
    {
      titulo: 'Katzenfütterung in Sants',
      descripcion: 'Ich bin ein paar Tage weg und brauche jemanden, der meine Katze einmal täglich füttert und die Katzentoilette in Sants reinigt.',
    },
    {
      titulo: 'Alter Router und Netzwerkkabel zu verschenken (Poblenou)',
      descripcion: 'Ich habe den Anbieter gewechselt und habe einen funktionierenden Ersatzrouter sowie mehrere Netzwerkkabel übrig. Kostenlos für jemanden in Poblenou.',
    },
    {
      titulo: 'Hilfe bei der Anmeldung / Padrón (Eixample)',
      descripcion: 'Ich brauche Hilfe, um das Anmeldeformular (Padrón) im Eixample zu verstehen, es ist nicht meine Muttersprache und ich tue mich schwer, es richtig auszufüllen.',
    },
    {
      titulo: 'Schubkarre zum Ausleihen (Zentrum Torredembarra)',
      descripcion: 'Ich erneuere meinen Garten und muss Erde und Steine transportieren. Hat jemand eine Schubkarre, die ich mir für ein paar Tage im Zentrum von Torredembarra ausleihen kann?',
    },
    {
      titulo: 'Hilfe bei der Reinigung des Hauseingangs nach dem Sommer',
      descripcion: 'Ich wohne in der Nähe des Strands von Torredembarra und nach dem Sommer sammelt sich viel Sand im Hauseingang. Ich suche Hilfe für eine gründliche Reinigung des Eingangsbereichs.',
    },
    {
      titulo: 'Motorfreischneider zu verleihen (Vilafortuny)',
      descripcion: 'Ich habe einen funktionierenden Motorfreischneider und verleihe ihn an Wochenenden an alle, die rund um Vilafortuny ihren Garten in Ordnung bringen müssen.',
    },
    {
      titulo: 'Mitfahrgelegenheit zum Bahnhof Torredembarra',
      descripcion: 'Ich fahre fast jeden Morgen früh zum Renfe-Bahnhof Torredembarra. Ich habe noch Platz für eine weitere Person in dieselbe Richtung.',
    },
    {
      titulo: 'Umzugskartons und Verpackungsmaterial zu verschenken',
      descripcion: 'Ich habe gerade einen Umzug im Zentrum von Torredembarra abgeschlossen und habe übrig gebliebene Kartons, Luftpolsterfolie und große Taschen in gutem Zustand, kostenlos abzugeben.',
    },
    {
      titulo: 'Hilfe beim Aufbau von Ikea-Möbeln (Sant Jordi)',
      descripcion: 'Ich habe einen Kleiderschrank und ein Bett von Ikea für das Haus in Sant Jordi gekauft und habe weder Werkzeug noch viel Ahnung. Kann mir jemand mit Erfahrung beim Aufbau helfen?',
    },
    {
      titulo: 'Englisch üben in Sant Jordi',
      descripcion: "Ich wohne in Sant Jordi d'Alfama und möchte gesprochenes Englisch üben. Im Gegenzug helfe ich gerne mit Spanisch oder Katalanisch, wir könnten uns auf einer Terrasse im Dorf treffen.",
    },
    {
      titulo: 'Dringend: Stromausfall, brauche einen Elektriker',
      descripcion: "Im ganzen Haus in Sant Jordi ist der Strom ausgefallen und ich kann den Sicherungsschalter nicht zurücksetzen. Es ist dringend, da mein Gefrierschrank voll ist - ist jemand mit Elektrikkenntnissen in der Nähe?",
    },
    {
      titulo: 'Tierbetreuung in Sant Jordi',
      descripcion: "Wenn du verreist und jemanden brauchst, der deinen Hund oder deine Katze rund um Sant Jordi d'Alfama füttert oder ausführt, kann ich helfen, ich habe Erfahrung mit Tieren.",
    },
    {
      titulo: 'Hilfe beim Schneiden einer hohen Hecke (Sant Jordi)',
      descripcion: 'Ich habe eine ziemlich hohe Hecke im Garten meines Hauses in Sant Jordi und komme nicht heran und habe nicht das richtige Werkzeug. Ich suche Hilfe beim Schneiden.',
    },
  ],
};

// Foto representativa por categoría, usada como imagen de cada card.
const CATEGORIA_IMAGENES: Record<string, string> = {
  Herramientas: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=800&auto=format&fit=crop',
  Jardinería: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop',
  Mascotas: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=800&auto=format&fit=crop',
  Transporte: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop',
  Mudanza: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  Idiomas: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop',
  Limpieza: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
  Trámites: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=800&auto=format&fit=crop',
  Reparaciones: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop',
  Ensamblaje: 'https://images.unsplash.com/photo-1593642634315-48f5414c6ae8?q=80&w=800&auto=format&fit=crop',
  Tecnología: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  Urgente: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=800&auto=format&fit=crop',
  Otros: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=800&auto=format&fit=crop',
};

export function getMockFavores(language: Language): Favor[] {
  const contenido = CONTENIDO[language] ?? CONTENIDO.es;
  return BASE.map((base, index) => ({
    ...base,
    ...contenido[index],
    imagen: CATEGORIA_IMAGENES[base.categoria] ?? CATEGORIA_IMAGENES.Otros,
  })) as Favor[];
}
