import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useLanguage } from '../../../context/LanguageContext';
import type { Language } from '../../../i18n/translations';

interface BurgerMenuProps {
  isFloating?: boolean; // Permite alternar si flota sobre el mapa o se integra en un Header
  showNotificationBadge?: boolean; // Muestra un punto si hay notificaciones sin leer
  onOpenFilters?: () => void; // Abre el panel de filtros (si se provee, agrega el ítem al menú)
  hasActiveFilters?: boolean; // Muestra un punto si hay filtros activos
}

export default function BurgerMenu({
  isFloating = false,
  showNotificationBadge = false,
  onOpenFilters,
  hasActiveFilters = false,
}: BurgerMenuProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const LANGUAGE_OPTIONS: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: t.language.spanish, flag: '🇪🇸' },
    { code: 'en', label: t.language.english, flag: '🇬🇧' },
    { code: 'de', label: t.language.german, flag: '🇩🇪' },
  ];

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
      Alert.alert(t.burgerMenu.logoutSuccessTitle, t.burgerMenu.logoutSuccessMessage);

      // Usamos goBack de manera segura para volver al mapa de fondo
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Welcome');
      }
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert(
        t.burgerMenu.logoutErrorTitle,
        t.burgerMenu.logoutErrorMessage.replace('{{message}}', error.message)
      );
    }
  };

  const handleVolverAlMapa = () => {
    setModalVisible(false);
    // Si el formulario se abrió encima del mapa, volver atrás es la forma más limpia de regresar
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleNotificaciones = () => {
    setModalVisible(false);
    navigation.navigate('Notifications');
  };

  const handleFiltros = () => {
    setModalVisible(false);
    onOpenFilters?.();
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
        activeOpacity={0.85}
      >
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotSmall]} />
          <View style={[styles.dot, styles.dotLarge]} />
          <View style={[styles.dot, styles.dotSmall]} />
        </View>
        {(showNotificationBadge || hasActiveFilters) && <View style={styles.notificationBadge} />}
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
                <View style={styles.menuHeader}>
                  <View style={styles.menuAvatar}>
                    <Text style={styles.menuAvatarIcon}>🪃</Text>
                  </View>
                  <Text style={styles.menuTitle}>{t.common.appName}</Text>
                </View>
                <View style={styles.divider} />

                {/* Opción: Volver al Mapa usando la función defensiva corregida */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleVolverAlMapa}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuItemIcon}>🗺️</Text>
                  <Text style={styles.menuItemText}>{t.burgerMenu.viewMap}</Text>
                </TouchableOpacity>

                {/* Opción: Notificaciones */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleNotificaciones}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuItemIcon}>🔔</Text>
                  <Text style={styles.menuItemText}>{t.burgerMenu.notifications}</Text>
                  {showNotificationBadge && <View style={styles.menuItemBadge} />}
                </TouchableOpacity>

                {/* Opción: Filtros */}
                {onOpenFilters && (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleFiltros}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.menuItemIcon}>🎛️</Text>
                    <Text style={styles.menuItemText}>{t.filters.title}</Text>
                    {hasActiveFilters && <View style={styles.menuItemBadge} />}
                  </TouchableOpacity>
                )}

                {/* SELECTOR DE IDIOMA */}
                <Text style={styles.sectionLabel}>{t.language.title}</Text>
                <View style={styles.languageRow}>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.code}
                      style={[
                        styles.languageOption,
                        language === option.code && styles.languageOptionActive,
                      ]}
                      onPress={() => setLanguage(option.code)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.languageFlag}>{option.flag}</Text>
                      <Text
                        style={[
                          styles.languageLabel,
                          language === option.code && styles.languageLabelActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* BOTÓN DE LOGOUT (Empujado al fondo) */}
                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout} activeOpacity={0.7}>
                  <Text style={styles.menuItemIcon}>🚪</Text>
                  <Text style={[styles.menuItemText, styles.logoutText]}>{t.burgerMenu.logout}</Text>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
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
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    backgroundColor: '#f97362',
    borderRadius: 6,
  },
  dotSmall: {
    width: 6,
    height: 6,
  },
  dotLarge: {
    width: 6,
    height: 14,
    borderRadius: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  menuItemBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginLeft: 'auto',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.35)',
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
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  menuAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fde0d6',
    borderWidth: 1,
    borderColor: '#fcc9bb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuAvatarIcon: {
    fontSize: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#fde0d6',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#fef3ec',
  },
  menuItemIcon: {
    fontSize: 18,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 4,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  languageOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#fef3ec',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  languageOptionActive: {
    backgroundColor: '#fde0d6',
    borderColor: '#f97362',
  },
  languageFlag: {
    fontSize: 20,
    marginBottom: 4,
  },
  languageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  languageLabelActive: {
    color: '#f97362',
  },
  logoutItem: {
    marginTop: 'auto',
    marginBottom: 40,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '700',
  },
});