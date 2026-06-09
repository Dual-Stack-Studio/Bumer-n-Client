import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importamos tu nuevo menú de hamburguesa con opción de logout
import BurgerMenu from '../components/BurgerMenu'; 

// Lista de categorías disponibles
const CATEGORIAS = ['Herramientas', 'Transporte', 'Mascotas', 'Jardinería', 'Otros'];

export default function PedirFavorScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Herramientas');

  // Simulación de la ubicación actual que heredará el favor
  const [ubicacionSimulada] = useState({ latitude: 48.1147, longitude: 14.5661, nombre: "Stadt Haag" });

  const handlePublicar = () => {
    if (!titulo.trim() || !descripcion.trim()) {
      alert('Por favor, completa el título y la descripción.');
      return;
    }

    // Estructura del nuevo favor listo para enviar a tu backend (Node.js + Postgres)
    const nuevoFavor = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      categoria: categoriaSeleccionada,
      ubicacion: {
        latitude: ubicacionSimulada.latitude,
        longitude: ubicacionSimulada.longitude
      },
      fecha: new Date().toISOString()
    };

    console.log('Enviando nuevo favor al servidor:', nuevoFavor);
    
    alert('¡Tu solicitud de favor ha sido publicada con éxito!');
    
    // Regresa a la pantalla principal (Mapa)
    navigation.navigate('Main');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* HEADER CON BOTÓN VOLVER Y BURGER MENU INTEGRADO */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Pedir un Favor</Text>
        
        {/* El BurgerMenu ahora balancea de forma nativa la esquina derecha del header */}
        <BurgerMenu />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeText}>¿Qué necesitas hoy de tus vecinos?</Text>

        {/* SECCIÓN 1: TÍTULO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título de tu solicitud</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Préstamo de escalera alta, Transportar un sillón..."
            placeholderTextColor="#94a3b8"
            value={titulo}
            onChangeText={setTitulo}
            maxLength={50}
          />
        </View>

        {/* SECCIÓN 2: CATEGORÍAS */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Selecciona una Categoría</Text>
          <View style={styles.categoriesContainer}>
            {CATEGORIAS.map((cat) => {
              const esActiva = categoriaSeleccionada === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.badge, esActiva && styles.badgeActiva]}
                  onPress={() => setCategoriaSeleccionada(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.badgeText, esActiva && styles.badgeTextActiva]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECCIÓN 3: DESCRIPCIÓN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Explica los detalles</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Sé lo más descriptivo posible. ¿Cuándo lo necesitas? ¿Hay algún detalle importante?"
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
            maxLength={300}
          />
        </View>

        {/* SECCIÓN 4: INFORMACIÓN DE UBICACIÓN AUTOMÁTICA */}
        <View style={styles.locationInfoBox}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>Ubicación de la publicación</Text>
            <Text style={styles.locationSubtitle}>Se publicará cerca de tu posición actual ({ubicacionSimulada.nombre})</Text>
          </View>
        </View>

      </ScrollView>

      {/* BOTÓN FIJO AL FINAL */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.submitButton} onPress={handlePublicar} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Publicar Solicitud</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  backIcon: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 24,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgeActiva: {
    backgroundColor: '#ccfbf1',
    borderColor: '#0f766e',
  },
  badgeText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  badgeTextActiva: {
    color: '#0f766e',
    fontWeight: '700',
  },
  locationInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccfbf1',
    marginTop: 8,
  },
  locationIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#115e59',
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#14b8a6',
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#0f766e',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});