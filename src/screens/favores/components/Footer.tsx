import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
// 1. Importamos GoogleSignin para verificar el estado real
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFavoritos } from '../../../context/FavoritosContext';
import { useLanguage } from '../../../context/LanguageContext';

export default function Footer() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { t } = useLanguage();
  const { favoritos } = useFavoritos();
  const tieneFavoritos = favoritos.length > 0;

 const handlePressPedir = async () => {
    try {
      // 2. Agregamos el await para esperar la respuesta real de Google
      const estaLogueadoReal = await GoogleSignin.hasPreviousSignIn();

      if (estaLogueadoReal) {
        // Si ya está logueado, va directo al formulario
        navigation.navigate('RequestFavor');
      } else {
        // ¡Aquí pasamos el parámetro! Le avisamos al Login a dónde quiere ir el usuario
        navigation.navigate('Login', { redirectTo: 'RequestFavor' });
      }
    } catch (error) {
      // Fallback de seguridad: si falla la verificación, igual pedimos login
      navigation.navigate('Login', { redirectTo: 'RequestFavor' });
    }
  };
  const handlePressPerfil = () => {
    const estaLogueadoReal = GoogleSignin.hasPreviousSignIn();

    if (estaLogueadoReal) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('Login', { redirectTo: 'Profile' });
    }
  };

  const handlePressFavoritos = () => {
    const estaLogueadoReal = GoogleSignin.hasPreviousSignIn();

    if (estaLogueadoReal) {
      navigation.navigate('Favoritos');
    } else {
      navigation.navigate('Login', { redirectTo: 'Favoritos' });
    }
  };

  const esExplorarActivo = route.name === 'Main';
  const esPedirActivo = route.name === 'RequestFavor';
  const esFavoritosActivo = route.name === 'Favoritos';

  return (
    <View style={[styles.footerContainer, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 16 }]}>
      
      {/* 1. BOTÓN EXPLORAR */}
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.icon}>🗺️</Text>
        <Text style={[styles.label, esExplorarActivo && styles.activeLabel]}>{t.footer.explore}</Text>
      </TouchableOpacity>

      {/* 2. BOTÓN PEDIR (Con la validación real en vivo) */}
      <TouchableOpacity 
        style={styles.tab}
        onPress={handlePressPedir}
      >
        <Text style={styles.icon}>➕</Text>
        <Text style={[styles.label, esPedirActivo && styles.activeLabel]}>{t.footer.request}</Text>
      </TouchableOpacity>

      {/* BOTÓN GUARDADOS */}
      <TouchableOpacity
        style={styles.tab}
        onPress={handlePressFavoritos}
      >
        <Text style={styles.icon}>{tieneFavoritos ? '❤️' : '🤍'}</Text>
        <Text style={[styles.label, (esFavoritosActivo || tieneFavoritos) && styles.activeLabel]}>{t.footer.saved}</Text>
      </TouchableOpacity>

      {/* 3. BOTÓN PERFIL (También protegido) */}
      <TouchableOpacity 
        style={styles.tab}
        onPress={handlePressPerfil}
      >
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.label}>{t.footer.profile}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#fde0d6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 20,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  activeLabel: {
    color: '#f97362',
    fontWeight: '800',
  }
});