import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// --- NUEVAS IMPORTACIONES PARA NAVEGACIÓN ---
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../App'; // Ajusta la ruta a tu App.tsx si es necesario

export default function DetailScreen() {
  const insets = useSafeAreaInsets();
  
  // 1. Instanciamos los hooks de navegación
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Detail'>>();

  // 2. Extraemos el 'favor' real que nos mandó la MainScreen
  const { favor } = route.params;

  // Imagen de prueba genérica (cuando tengamos BD, esto vendrá en favor.imagen)
  const imagenPlaceholder = "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop";

  return (
    <View style={styles.container}>
      
      {/* 1. IMAGEN Y BOTÓN DE VOLVER */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imagenPlaceholder }} style={styles.image} />
        
        {/* 3. Le damos funcionalidad al botón de atrás */}
        <TouchableOpacity 
          style={[styles.backButton, { top: Math.max(insets.top, 20) }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
      </View>

      {/* 2. CONTENIDO PRINCIPAL */}
      <ScrollView 
        style={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          {/* 4. Inyectamos los datos dinámicos */}
          <Text style={styles.title}>{favor.titulo}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{favor.categoria}</Text>
          </View>
        </View>

        <View style={styles.locationBox}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>
            {/* Formateamos la distancia que calculó MainScreen */}
            {favor.distancia 
              ? `A ${favor.distancia < 1 ? Math.round(favor.distancia * 1000) + ' m' : favor.distancia.toFixed(1) + ' km'} de ti` 
              : 'Ubicación oculta'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Detalles</Text>
        <Text style={styles.description}>{favor.descripcion}</Text>
      </ScrollView>

      {/* 3. BOTÓN DE ACCIÓN FIJO AL FINAL */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Ofrecer ayuda</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    height: '35%', 
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backIcon: {
    fontSize: 18,
    marginLeft: -2, 
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30, 
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    marginRight: 16,
  },
  categoryBadge: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#0f766e',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24, 
    marginBottom: 40,
  },
  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  primaryButton: {
    backgroundColor: '#0f766e', 
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  }
});