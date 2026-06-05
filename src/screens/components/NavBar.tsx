import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Definimos las props que va a recibir desde MainScreen
interface NavBarProps {
  busqueda: string;
  setBusqueda: (texto: string) => void;
}

export default function NavBar({ busqueda, setBusqueda }: NavBarProps) {
  return (
    <SafeAreaView style={styles.navbarContainer} pointerEvents="box-none">
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar taladro, jardín, mascotas..."
          placeholderTextColor="#94a3b8"
          value={busqueda}
          onChangeText={setBusqueda}
          clearButtonMode="while-editing"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 10,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    height: '100%',
  },
});