import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface BurgerMenuProps {
  isFloating?: boolean; // Permite alternar si flota sobre el mapa o se integra en un Header
}

export default function BurgerMenu({ isFloating = false }: BurgerMenuProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);

 const handleLogout = async () => {
    try {
      // 1. Usamos el método moderno para verificar si hay una sesión activa
      const tieneSesion = GoogleSignin.hasPreviousSignIn();
      
      if (tieneSesion) {
        // Revocamos los tokens de acceso y deslogueamos limpiamente
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      
      setModalVisible(false);
      Alert.alert('Sesión cerrada', 'Has salido de tu cuenta correctamente.');
      
      // Usamos goBack de manera segura para volver al mapa de fondo
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Welcome');
      }
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', `No se pudo cerrar la sesión: ${error.message}`);
    }
  };

  const handleVolverAlMapa = () => {
    setModalVisible(false);
    // Si el formulario se abrió encima del mapa, volver atrás es la forma más limpia de regresar
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <>
      {/* BOTÓN BURGER (Flotante o relativo según la pantalla) */}
      <TouchableOpacity 
        style={[
          styles.burgerButton, 
          isFloating ? [styles.floatingButton, { top: Math.max(insets.top - 10, 8) }] : styles.relativeButton
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
      </TouchableOpacity>

      {/* MODAL DESPLEGABLE LATERAL (OVERLAY) */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Al presionar fuera del menú lateral, este se cierra de inmediato */}
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.menuContainer, { paddingTop: Math.max(insets.top, 20) }]}>
                
                {/* Info superior del menú */}
                <Text style={styles.menuTitle}>Mi Comunidad</Text>
                <View style={styles.divider} />

                {/* Opción: Volver al Mapa usando la función defensiva corregida */}
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={handleVolverAlMapa}
                >
                  <Text style={styles.menuItemText}>🗺️ Ver el Mapa</Text>
                </TouchableOpacity>

                {/* BOTÓN DE LOGOUT (Empujado al fondo) */}
                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                  <Text style={[styles.menuItemText, styles.logoutText]}>🚪 Cerrar Sesión</Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  burgerButton: {
    backgroundColor: '#ffffff',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  // Configuración cuando flota encima del mapa (MainScreen)
  floatingButton: {
    position: 'absolute',
    right: 16,
    zIndex: 1000,
    
  },
  // Configuración limpia cuando está dentro de un Header con Flexbox (PedirFavorScreen)
  relativeButton: {
    position: 'relative',
  },
  burgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#1e293b',
    borderRadius: 2,
    marginVertical: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end', 
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    width: '65%', 
    height: '100%',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  logoutItem: {
    marginTop: 'auto', 
    marginBottom: 40,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
    paddingTop: 20,
  },
  logoutText: {
    color: '#ef4444', 
    fontWeight: '700',
  },
});