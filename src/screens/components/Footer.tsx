import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
// 1. Importamos GoogleSignin para verificar el estado real
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function Footer() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute();

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
      // Más adelante aquí navegarás a tu pantalla de Perfil (ej. navigation.navigate('ProfileScreen'))
      alert('¡Aquí irá tu pantalla de Perfil de usuario!');
    } else {
      navigation.navigate('Login');
    }
  };

  const esExplorarActivo = route.name === 'Main';
  const esPedirActivo = route.name === 'RequestFavor';

  return (
    <View style={[styles.footerContainer, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 16 }]}>
      
      {/* 1. BOTÓN EXPLORAR */}
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.icon}>🗺️</Text>
        <Text style={[styles.label, esExplorarActivo && styles.activeLabel]}>Explorar</Text>
      </TouchableOpacity>

      {/* 2. BOTÓN PEDIR (Con la validación real en vivo) */}
      <TouchableOpacity 
        style={styles.tab}
        onPress={handlePressPedir}
      >
        <Text style={styles.icon}>➕</Text>
        <Text style={[styles.label, esPedirActivo && styles.activeLabel]}>Pedir</Text>
      </TouchableOpacity>

      {/* 3. BOTÓN PERFIL (También protegido) */}
      <TouchableOpacity 
        style={styles.tab}
        onPress={handlePressPerfil}
      >
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.label}>Perfil</Text>
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
    borderColor: '#e2e8f0',
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
    color: '#64748b',
    fontWeight: '600',
  },
  activeLabel: {
    color: '#0f766e',
    fontWeight: '800',
  }
});