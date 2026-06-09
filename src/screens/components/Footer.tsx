import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// 1. Importamos el hook de navegación
import { useNavigation } from '@react-navigation/native';

export default function Footer() {
  const insets = useSafeAreaInsets();
  
  // 2. Inicializamos el objeto de navegación
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.footerContainer, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 16 }]}>
      
      {/* Botón Explorar (Activo por defecto) */}
      <TouchableOpacity style={styles.tab}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={[styles.label, styles.activeLabel]}>Explorar</Text>
      </TouchableOpacity>

      {/* 3. Agregamos el evento onPress para abrir el Login */}
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.icon}>➕</Text>
        <Text style={styles.label}>Pedir</Text>
      </TouchableOpacity>

      {/* 4. Repetimos el evento onPress para el Perfil */}
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => navigation.navigate('Login')}
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
    // Sombra sutil hacia arriba
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 20, // Asegura que quede por encima de todo
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
    color: '#0f766e', // Teal oscuro para la pestaña activa
    fontWeight: '800',
  }
});