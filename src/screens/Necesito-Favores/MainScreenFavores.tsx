import React, { useRef, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // <-- Añadimos TouchableOpacity
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

// --- IMPORTACIONES DE NAVEGACIÓN ---
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App'; // Ajusta los '../' si tu App.tsx está en otro nivel

// Importamos tu nuevo componente NavBar
import NavBar from '../components/NavBar'; 
import mockFavores from '../../data/mockFavores.json';
import Footer from '../components/Footer';
import BurgerMenu from '../components/BurgerMenu';

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

interface Favor {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  ubicacion: {
    latitude: number;
    longitude: number;
  };
  distancia?: number;
}

export default function MainScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '45%', '85%'], []);

  // --- INICIALIZAMOS LA NAVEGACIÓN ---
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Estados
  const [miUbicacion] = useState({ latitude: 48.1147, longitude: 14.5661 });
  const [busqueda, setBusqueda] = useState(''); 

  const favoresProcesados = useMemo(() => {
    const textoBusqueda = busqueda.toLowerCase();
    const filtrados = mockFavores.filter((favor) => 
      favor.titulo.toLowerCase().includes(textoBusqueda) || 
      favor.categoria.toLowerCase().includes(textoBusqueda)
    );

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
  }, [miUbicacion, busqueda]);

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
        {favoresProcesados.map((favor: Favor) => (
          <Marker 
            key={favor.id} 
            coordinate={{ 
              latitude: favor.ubicacion.latitude, 
              longitude: favor.ubicacion.longitude 
            }}
            title={favor.titulo}
            description={favor.descripcion}
            pinColor="#fb923c"
          />
        ))}
      </MapView>

      <NavBar busqueda={busqueda} setBusqueda={setBusqueda} />
      {/* EL BURGER MENU FLOTANTE */}
      <BurgerMenu />

      <BottomSheet 
        ref={bottomSheetRef} 
        index={1} 
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        keyboardBehavior="extend" 
        bottomInset={80}
      >
        
        <View style={styles.header}>
          <Text style={styles.title}>
            {busqueda.length > 0 ? 'Resultados de búsqueda' : 'Favores cercanos'}
          </Text>
          <Text style={styles.subtitle}>
            {favoresProcesados.length} {favoresProcesados.length === 1 ? 'favor encontrado' : 'favores encontrados'}
          </Text>
        </View>

        <BottomSheetFlatList
          data={favoresProcesados as Favor[]} 
          keyExtractor={(item: Favor) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled" 
          renderItem={({ item }: { item: Favor }) => (
            // --- ENVOLVEMOS LA CARD PARA HACERLA CLICKLEABLE ---
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => navigation.navigate('Detail', { favor: item })}
            >
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
                  
                  <View style={styles.badgesContainer}>
                    <Text style={styles.distanceText}>
                      📍 {formatearDistancia(item.distancia)}
                    </Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{item.categoria}</Text>
                    </View>
                  </View>

                </View>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.descripcion}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
      <Footer />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  bottomSheetBackground: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleIndicator: {
    backgroundColor: '#cbd5e1',
    width: 50,
    height: 5,
    borderRadius: 5,
  },
  header: { 
    paddingHorizontal: 24, 
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '800',
    color: '#1e293b'
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#0f172a',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8, 
  },
  distanceText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: { 
    fontSize: 12, 
    color: '#0f766e',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardDesc: { 
    color: '#475569', 
    fontSize: 14,
    lineHeight: 20,
  },
});