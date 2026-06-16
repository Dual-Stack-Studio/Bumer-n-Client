import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../../context/LanguageContext';
import { getMockNotificaciones } from '../../../data/mockNotificaciones';
import BurgerMenu from './BurgerMenu';

// Definimos las props que va a recibir desde MainScreen
interface NavBarProps {
  busqueda: string;
  setBusqueda: (texto: string) => void;
  hiddenAnim?: Animated.Value;
  onOpenFilters?: () => void;
  hasActiveFilters?: boolean;
}

export default function NavBar({ busqueda, setBusqueda, hiddenAnim, onOpenFilters, hasActiveFilters }: NavBarProps) {
  const { t } = useLanguage();
  const hayNoLeidas = getMockNotificaciones(t).some((n) => !n.leida);

  const animatedSearchStyle = hiddenAnim
    ? {
        opacity: hiddenAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
        transform: [
          {
            translateY: hiddenAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -90],
            }),
          },
        ],
      }
    : null;

  return (
    <SafeAreaView style={styles.navbarContainer} pointerEvents="box-none">
      <View style={styles.row}>
        <Animated.View style={[styles.searchBox, animatedSearchStyle]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t.navbar.searchPlaceholder}
            placeholderTextColor="#94a3b8"
            value={busqueda}
            onChangeText={setBusqueda}
            clearButtonMode="while-editing"
          />
        </Animated.View>

        <BurgerMenu
          showNotificationBadge={hayNoLeidas}
          onOpenFilters={onOpenFilters}
          hasActiveFilters={hasActiveFilters}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
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
    color: '#1e293b',
    height: '100%',
  },
});
