import React, { useState, useEffect } from 'react';
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
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../App';

// Importamos tu nuevo menú de hamburguesa con opción de logout
import BurgerMenu from '../components/BurgerMenu';
import { actualizarFavor, crearFavor } from '../../../api/favoresApi';
import { CATEGORIAS } from '../../../data/categories';
import { getOpcionesExpiracion } from '../../../utils/favorHelpers';
import { Favor } from '../../../types/favor';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { formatMessage } from '../../../i18n/format';

export default function PedirFavorScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RootStackParamList, 'RequestFavor'>>();
  const favorEditar = route.params?.favorEditar as Favor | undefined;
  const esEdicion = !!favorEditar;
  const { t } = useLanguage();
  const { token } = useAuth();

  // Tipos de publicación disponibles
  const TIPOS_PUBLICACION: { id: Favor['tipo']; label: string; icon: string }[] = [
    { id: 'necesito', label: t.pedirFavor.tipoNecesito, icon: '🙋' },
    { id: 'ofrezco', label: t.pedirFavor.tipoOfrezco, icon: '🤝' },
    { id: 'regalo', label: t.pedirFavor.tipoRegalo, icon: '🎁' },
  ];
  const OPCIONES_EXPIRACION = getOpcionesExpiracion(t);

  // Estados del formulario
  const [tipoSeleccionado, setTipoSeleccionado] = useState<Favor['tipo']>(favorEditar?.tipo ?? 'necesito');
  const [titulo, setTitulo] = useState(favorEditar?.titulo ?? '');
  const [descripcion, setDescripcion] = useState(favorEditar?.descripcion ?? '');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(favorEditar?.categoria ?? CATEGORIAS[0].label);
  const [expiracionSeleccionada, setExpiracionSeleccionada] = useState(OPCIONES_EXPIRACION[2]); // 7 días
  const [telefono, setTelefono] = useState(favorEditar?.telefonoContacto ?? '');
  const [publicando, setPublicando] = useState(false);
  const [ubicacion, setUbicacion] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorUbicacion, setErrorUbicacion] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('[Location] permission status:', status);
      if (status !== 'granted') {
        setErrorUbicacion(t.pedirFavor.locationPermissionDenied ?? 'Permiso de ubicación denegado');
        return;
      }
      try {
        let ultima: Location.LocationObject | null = null;
        try {
          ultima = await Location.getLastKnownPositionAsync({});
        } catch {
          // El servicio aún no tiene posición guardada — continuamos con getCurrentPositionAsync
        }

        if (ultima) {
          console.log('[Location] last known:', ultima.coords.latitude, ultima.coords.longitude);
          setUbicacion({ latitude: ultima.coords.latitude, longitude: ultima.coords.longitude });
          return;
        }

        const loc = await Promise.race([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Tiempo de espera agotado al obtener ubicación')), 10000)
          ),
        ]);
        console.log('[Location] coords:', loc.coords.latitude, loc.coords.longitude);
        setUbicacion({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch (e: any) {
        console.warn('[Location] error:', e.message);
        setErrorUbicacion(e.message);
      }
    })();
  }, []);

  const handlePublicar = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      alert(t.pedirFavor.alertFillRequired);
      return;
    }

    if (!ubicacion) {
      alert(t.pedirFavor.locationNotReady ?? 'Todavía obteniendo tu ubicación, intentá de nuevo en un momento.');
      return;
    }

    setPublicando(true);
    try {
      if (esEdicion && favorEditar) {
        await actualizarFavor(favorEditar.id, {
          tipo: tipoSeleccionado,
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          categoria: categoriaSeleccionada,
          telefonoContacto: telefono.trim() || undefined,
        }, token!);

        alert(t.pedirFavor.alertUpdated);
        navigation.navigate('Profile');
        return;
      }

      const expiraEn = new Date(Date.now() + expiracionSeleccionada.horas * 60 * 60 * 1000).toISOString();

      await crearFavor({
        tipo: tipoSeleccionado,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria: categoriaSeleccionada,
        latitude: ubicacion.latitude,
        longitude: ubicacion.longitude,
        expiraEn,
        telefonoContacto: telefono.trim() || undefined,
      }, token!);

      alert(t.pedirFavor.alertCreated);

      // Regresa a la pantalla principal (Mapa)
      navigation.navigate('Main');
    } catch (error: any) {
      alert(formatMessage(t.pedirFavor.alertSaveError, { message: error.message }));
    } finally {
      setPublicando(false);
    }
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
        
        <Text style={styles.headerTitle}>{esEdicion ? t.pedirFavor.editTitle : t.pedirFavor.createTitle}</Text>
        
        {/* El BurgerMenu ahora balancea de forma nativa la esquina derecha del header */}
        <BurgerMenu />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeText}>{t.pedirFavor.welcomeText}</Text>

        {/* SECCIÓN 0: TIPO DE PUBLICACIÓN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.pedirFavor.whatToDo}</Text>
          <View style={styles.tiposContainer}>
            {TIPOS_PUBLICACION.map((tipo) => {
              const esActivo = tipoSeleccionado === tipo.id;
              return (
                <TouchableOpacity
                  key={tipo.id}
                  style={[styles.tipoCard, esActivo && styles.tipoCardActivo]}
                  onPress={() => setTipoSeleccionado(tipo.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tipoIcon}>{tipo.icon}</Text>
                  <Text style={[styles.tipoLabel, esActivo && styles.tipoLabelActivo]}>
                    {tipo.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECCIÓN 1: TÍTULO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.pedirFavor.tituloLabel}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.pedirFavor.tituloPlaceholder}
            placeholderTextColor="#94a3b8"
            value={titulo}
            onChangeText={setTitulo}
            maxLength={50}
          />
        </View>

        {/* SECCIÓN 2: CATEGORÍAS */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.pedirFavor.categoriaLabel}</Text>
          <View style={styles.categoriesContainer}>
            {CATEGORIAS.map((cat) => {
              const esActiva = categoriaSeleccionada === cat.label;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.badge, esActiva && styles.badgeActiva]}
                  onPress={() => setCategoriaSeleccionada(cat.label)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.badgeText, esActiva && styles.badgeTextActiva]}>
                    {cat.icon} {t.categories[cat.id as keyof typeof t.categories] ?? cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECCIÓN 3.5: TIEMPO DE EXPIRACIÓN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.pedirFavor.expiracionLabel}</Text>
          <View style={styles.categoriesContainer}>
            {OPCIONES_EXPIRACION.map((opcion) => {
              const esActiva = expiracionSeleccionada.label === opcion.label;
              return (
                <TouchableOpacity
                  key={opcion.label}
                  style={[styles.badge, esActiva && styles.badgeActiva]}
                  onPress={() => setExpiracionSeleccionada(opcion)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.badgeText, esActiva && styles.badgeTextActiva]}>
                    {opcion.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECCIÓN 3: DESCRIPCIÓN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.pedirFavor.descripcionLabel}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t.pedirFavor.descripcionPlaceholder}
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
            maxLength={300}
          />
        </View>

        {/* SECCIÓN 4: TELÉFONO DE CONTACTO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.pedirFavor.telefonoLabel}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.pedirFavor.telefonoPlaceholder}
            placeholderTextColor="#94a3b8"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            maxLength={20}
          />
          <Text style={styles.telefonoHint}>{t.pedirFavor.telefonoHint}</Text>
        </View>

        {/* SECCIÓN 5: INFORMACIÓN DE UBICACIÓN AUTOMÁTICA */}
        <View style={styles.locationInfoBox}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>{t.pedirFavor.locationTitle}</Text>
            {errorUbicacion ? (
              <Text style={[styles.locationSubtitle, { color: '#e11d48' }]}>{errorUbicacion}</Text>
            ) : ubicacion ? (
              <Text style={styles.locationSubtitle}>
                {ubicacion.latitude.toFixed(5)}, {ubicacion.longitude.toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.locationSubtitle}>
                {t.pedirFavor.locationLoading ?? 'Obteniendo ubicación…'}
              </Text>
            )}
          </View>
        </View>

      </ScrollView>

      {/* BOTÓN FIJO AL FINAL */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.submitButton, publicando && styles.submitButtonDisabled]}
          onPress={handlePublicar}
          activeOpacity={0.8}
          disabled={publicando}
        >
          <Text style={styles.submitButtonText}>
            {publicando
              ? t.pedirFavor.saving
              : esEdicion
                ? t.pedirFavor.saveChanges
                : t.pedirFavor.publish}
          </Text>
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
  tiposContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tipoCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tipoCardActivo: {
    backgroundColor: '#fffbeb',
    borderColor: '#e11d48',
  },
  tipoIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  tipoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
  },
  tipoLabelActivo: {
    color: '#e11d48',
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
    backgroundColor: '#fef3c7',
    borderColor: '#e11d48',
  },
  badgeText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  badgeTextActiva: {
    color: '#e11d48',
    fontWeight: '700',
  },
  telefonoHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
    lineHeight: 16,
  },
  locationInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fef3c7',
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
    color: '#92400e',
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#d97706',
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
    backgroundColor: '#e11d48',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#e11d48',
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
});