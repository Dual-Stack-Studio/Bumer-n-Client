import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // <-- Añadimos TouchableOpacity
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

// --- IMPORTACIONES DE NAVEGACIÓN ---
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App'; // Ajusta los '../' si tu App.tsx está en otro nivel

// Importamos tu nuevo componente NavBar
import NavBar from '../favores/components/NavBar';
import { getFavores } from '../../api/favoresApi';
import Footer from '../favores/components/Footer';
import FiltersModal from '../favores/components/FiltersModal';
import CategoryPills from './components/CategoryPills';
import { Favor } from '../../types/favor';
import { getEstadoBadge, getTiempoRestante } from '../../utils/favorHelpers';
import { useFavoritos } from '../../context/FavoritosContext';
import { useLanguage } from '../../context/LanguageContext';

// --- FÓRMULAS MATEMÁTICAS (Haversine) ---
function getDistanciaEnKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

// interface Favor {
//   id: string;
//   tipo: 'necesito' | 'ofrezco' | 'regalo';  // ← agregar esto
//   titulo: string;
//   descripcion: string;
//   categoria: string;
//   ubicacion: {
//     latitude: number;
//     longitude: number;
//   };
//   estado: 'abierto' | 'en_proceso' | 'cerrado';
//   creadoEn: string;
//   distancia?: number;
// }

const getPinColor = (tipo: string) => {
  switch (tipo) {
    case 'necesito': return '#fb923c';
    case 'ofrezco':  return '#22c55e';
    case 'regalo':   return '#3b82f6';
    default:         return '#fb923c';
  }
};
// Según la intención elegida en la pantalla de bienvenida, mostramos
// solo los favores que le sirven a ese tipo de usuario.
const TIPOS_POR_INTENCION: Record<string, Favor['tipo'][]> = {
  necesito: ['ofrezco', 'regalo'],
  ofrezco: ['necesito'],
};

export default function MainScreen() {
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '45%', '85%'], []);
  const [activeCategory, setActiveCategory] = useState('todos');
  // --- INICIALIZAMOS LA NAVEGACIÓN ---
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Main'>>();
  const intencion = route.params?.intencion;
  const [tiposFiltro, setTiposFiltro] = useState<Favor['tipo'][] | null>(
    intencion ? TIPOS_POR_INTENCION[intencion] : null
  );

  // Estados
  const [miUbicacion] = useState({ latitude: 48.1147, longitude: 14.5661 });
  const [busqueda, setBusqueda] = useState('');
  const [favores, setFavores] = useState<Favor[]>([]);
  const { favoritos, esFavorito, toggleFavorito } = useFavoritos();

  // Filtros del panel de filtros (botón flotante)
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState<Favor['tipo'][]>([]);
  const [estadoFiltro, setEstadoFiltro] = useState<Favor['estado'][]>([]);
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const cargarFavores = useCallback(async () => {
    try {
      const data = await getFavores(language);
      setFavores(data);
    } catch (error) {
      console.log('Error al cargar favores:', error);
    }
  }, [language]);

  // Recarga la lista cada vez que la pantalla vuelve a estar en foco
  // (por ejemplo, al volver de publicar un nuevo favor)
  useFocusEffect(
    useCallback(() => {
      cargarFavores();
    }, [cargarFavores])
  );

 const favoresProcesados = useMemo(() => {
  const textoBusqueda = busqueda.toLowerCase();
  const filtrados = favores.filter((favor) => {
    const matchCategoria = activeCategory === 'todos' ||
      favor.categoria.toLowerCase() === activeCategory.toLowerCase();
    const matchTipo = !tiposFiltro || tiposFiltro.includes(favor.tipo);
    const matchBusqueda =
      favor.titulo.toLowerCase().includes(textoBusqueda) ||
      favor.categoria.toLowerCase().includes(textoBusqueda);
    const matchTipoFiltro = tipoFiltro.length === 0 || tipoFiltro.includes(favor.tipo);
    const matchEstadoFiltro = estadoFiltro.length === 0 || estadoFiltro.includes(favor.estado);
    const matchFavoritos = !soloFavoritos || favoritos.includes(favor.id);
    return matchCategoria && matchTipo && matchBusqueda && matchTipoFiltro && matchEstadoFiltro && matchFavoritos;
  });

  const conDistancias = filtrados.map((favor) => {
    const distancia = getDistanciaEnKm(
      miUbicacion.latitude,
      miUbicacion.longitude,
      favor.ubicacion.latitude,
      favor.ubicacion.longitude
    );
    return { ...favor, distancia };
  });

  return conDistancias.sort((a, b) => {
    if (a.categoria < b.categoria) return -1;
    if (a.categoria > b.categoria) return 1;
    return (a.distancia || 0) - (b.distancia || 0);
  });
}, [favores, miUbicacion, busqueda, activeCategory, tiposFiltro, tipoFiltro, estadoFiltro, soloFavoritos, favoritos]);

  const hayFiltrosActivos = tipoFiltro.length > 0 || estadoFiltro.length > 0 || soloFavoritos;

  const formatearDistancia = (distKm?: number) => {
    if (distKm === undefined) return '';
    if (distKm < 1) return `${Math.round(distKm * 1000)} m`; 
    return `${distKm.toFixed(1)} km`; 
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView 
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        initialRegion={{ 
          latitude: miUbicacion.latitude, 
          longitude: miUbicacion.longitude, 
          latitudeDelta: 0.05, 
          longitudeDelta: 0.05 
        }}
        showsUserLocation={true}
      >
       {(favoresProcesados as Favor[]).map((favor) => (
          <Marker 
            key={favor.id} 
            coordinate={{ 
              latitude: favor.ubicacion.latitude, 
              longitude: favor.ubicacion.longitude 
            }}
            title={favor.titulo}
            description={favor.descripcion}
       pinColor={getPinColor(favor.tipo) as any}
          />
        ))}
      </MapView>

      <NavBar busqueda={busqueda} setBusqueda={setBusqueda} />
      {/* BOTÓN FLOTANTE DE FILTROS */}
      <TouchableOpacity
        style={[styles.filterButton, { top: Math.max(insets.top - 10, 8) }]}
        onPress={() => setFiltersVisible(true)}
        activeOpacity={0.85}
      >
        {hayFiltrosActivos && <View style={styles.filterBadge} />}
        <View style={styles.filterIconLine}>
          <View style={[styles.filterKnob, { left: '60%' }]} />
        </View>
        <View style={styles.filterIconLine}>
          <View style={[styles.filterKnob, { left: '25%' }]} />
        </View>
        <View style={styles.filterIconLine}>
          <View style={[styles.filterKnob, { left: '75%' }]} />
        </View>
      </TouchableOpacity>

      <FiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        tipoFiltro={tipoFiltro}
        onChangeTipo={setTipoFiltro}
        estadoFiltro={estadoFiltro}
        onChangeEstado={setEstadoFiltro}
        soloFavoritos={soloFavoritos}
        onChangeSoloFavoritos={setSoloFavoritos}
        resultCount={favoresProcesados.length}
        onClear={() => {
          setTipoFiltro([]);
          setEstadoFiltro([]);
          setSoloFavoritos(false);
        }}
      />

      <BottomSheet 
        ref={bottomSheetRef} 
        index={1} 
        snapPoints={snapPoints}
        activeOffsetY={[-10, 10]}     // solo activa el sheet con gestos verticales
        failOffsetX={[-15, 15]}  
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        keyboardBehavior="extend" 
        bottomInset={80}
      >
        
        <View style={styles.header}>
          <Text style={styles.title}>
            {busqueda.length > 0 ? t.main.searchResults : t.main.nearbyFavors}
          </Text>
          <Text style={styles.subtitle}>
            {favoresProcesados.length} {favoresProcesados.length === 1 ? t.main.favorFound : t.main.favorsFound}
          </Text>
        </View>

        {tiposFiltro && (
          <View style={styles.filtroIntencionBanner}>
            <Text style={styles.filtroIntencionTexto}>
              {intencion === 'necesito'
                ? t.main.filterNecesito
                : t.main.filterOfrezco}
            </Text>
            <TouchableOpacity onPress={() => setTiposFiltro(null)}>
              <Text style={styles.filtroIntencionLink}>{t.main.viewAll}</Text>
            </TouchableOpacity>
          </View>
        )}

        <CategoryPills
        selectedCategory={activeCategory}
        onSelectCategory={(categoryId) => {
          setActiveCategory(categoryId);
          // Aquí más adelante llamaremos a la función para filtrar el mapa

        }}
      />

        <BottomSheetFlatList
          data={favoresProcesados as Favor[]} 
          keyExtractor={(item: Favor) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled" 
          renderItem={({ item }: { item: Favor }) => {
            const estadoBadge = getEstadoBadge(item, t);
            return (
            // --- ENVOLVEMOS LA CARD PARA HACERLA CLICKLEABLE ---
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Detail', { favor: item })}
            >
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
                    <TouchableOpacity onPress={() => toggleFavorito(item.id)} hitSlop={8}>
                      <Text style={styles.heartIcon}>{esFavorito(item.id) ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.badgesContainer}>
                    <Text style={styles.distanceText}>
                      📍 {formatearDistancia(item.distancia)}
                    </Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{item.categoria}</Text>
                    </View>
                    <View style={[styles.estadoBadge, { backgroundColor: estadoBadge.bg }]}>
                      <Text style={[styles.estadoText, { color: estadoBadge.text }]}>{estadoBadge.label}</Text>
                    </View>
                    <Text style={styles.expiraText}>⏳ {getTiempoRestante(item, t)}</Text>
                  </View>

                </View>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.descripcion}
                </Text>
              </View>
            </TouchableOpacity>
            );
          }}
        />
      </BottomSheet>
      <Footer />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef3ec',
  },
  filterButton: {
    position: 'absolute',
    right: 16,
    zIndex: 1000,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  filterIconLine: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#94a3b8',
    justifyContent: 'center',
  },
  filterKnob: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97362',
    top: -3,
    marginLeft: -4,
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#f97362',
    zIndex: 1,
  },
  bottomSheetBackground: {
    backgroundColor: '#fef3ec',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleIndicator: {
    backgroundColor: '#fcc9bb',
    width: 50,
    height: 5,
    borderRadius: 5,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#fde0d6'
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b'
  },
  subtitle: {
    fontSize: 14,
    color: '#92785f',
    marginTop: 4,
  },
  filtroIntencionBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6f7f1',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filtroIntencionTexto: {
    fontSize: 13,
    color: '#1f8a64',
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  filtroIntencionLink: {
    fontSize: 13,
    color: '#1f8a64',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginRight: 8,
  },
  heartIcon: {
    fontSize: 18,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8, 
  },
  distanceText: {
    fontSize: 13,
    color: '#92785f',
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: '#fde0d6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#c2410c',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  expiraText: {
    fontSize: 12,
    color: '#92785f',
    fontWeight: '600',
  },
  cardDesc: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
});