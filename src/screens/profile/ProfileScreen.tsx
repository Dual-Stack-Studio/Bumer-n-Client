import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { eliminarFavor, getFavores } from '../../api/favoresApi';
import { useAuth } from '../../context/AuthContext';
import { Favor } from '../../types/favor';
import { useLanguage } from '../../context/LanguageContext';
import { formatMessage } from '../../i18n/format';
import type { Translation } from '../../i18n/translations';

const getTipoBadge = (tipo: Favor['tipo'], t: Translation) => {
  switch (tipo) {
    case 'necesito':
      return { label: t.detail.badgeNecesito, bg: '#fff7ed', text: '#c2410c' };
    case 'ofrezco':
      return { label: t.detail.badgeOfrezco, bg: '#f0fdf4', text: '#15803d' };
    case 'regalo':
      return { label: t.detail.badgeRegalo, bg: '#eff6ff', text: '#1d4ed8' };
  }
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { t, language } = useLanguage();
  const { googleUser, usuarioId, cerrarSesion } = useAuth();

  const [misPublicaciones, setMisPublicaciones] = useState<Favor[]>([]);
  const favoresOfrecidos = misPublicaciones.filter((f) => f.tipo === 'ofrezco').length;

  useFocusEffect(
    useCallback(() => {
      if (!usuarioId) {
        setMisPublicaciones([]);
        return;
      }
      getFavores(language, usuarioId).then(setMisPublicaciones).catch(() => setMisPublicaciones([]));
    }, [language, usuarioId])
  );

  const handleEditar = (favor: Favor) => {
    navigation.navigate('RequestFavor', { favorEditar: favor });
  };

  const handleEliminar = (favor: Favor) => {
    Alert.alert(
      t.profile.deleteTitle,
      formatMessage(t.profile.deleteMessage, { titulo: favor.titulo }),
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.profile.eliminarBtn,
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarFavor(favor.id);
              setMisPublicaciones((prev) => prev.filter((f) => f.id !== favor.id));
            } catch (error: any) {
              Alert.alert(t.profile.deleteTitle, error.message);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      if (GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      cerrarSesion();
      Alert.alert(t.burgerMenu.logoutSuccessTitle, t.burgerMenu.logoutSuccessMessage);
      navigation.navigate('Main');
    } catch (error: any) {
      Alert.alert(t.burgerMenu.logoutErrorTitle, formatMessage(t.burgerMenu.logoutErrorMessage, { message: error.message }));
    }
  };

  const avatarUri = googleUser?.user.photo;
  const nombre = googleUser?.user.name || t.profile.defaultName;
  const email = googleUser?.user.email || '';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.profile.title}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
          )}
          <Text style={styles.nombre}>{nombre}</Text>
          {email ? <Text style={styles.email}>{email}</Text> : null}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumero}>{misPublicaciones.length}</Text>
            <Text style={styles.statLabel}>{t.profile.misSolicitudes}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumero}>{favoresOfrecidos}</Text>
            <Text style={styles.statLabel}>{t.profile.favoresOfrecidos}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t.profile.misPublicaciones}</Text>
        {misPublicaciones.map((favor) => {
          const badge = getTipoBadge(favor.tipo, t);
          return (
            <View key={favor.id} style={styles.favorCard}>
              <View style={styles.favorCardHeader}>
                <Text style={styles.favorTitulo} numberOfLines={1}>{favor.titulo}</Text>
                <View style={[styles.tipoBadge, { backgroundColor: badge?.bg }]}>
                  <Text style={[styles.tipoBadgeText, { color: badge?.text }]}>{badge?.label}</Text>
                </View>
              </View>
              <Text style={styles.favorDesc} numberOfLines={2}>{favor.descripcion}</Text>
              <View style={styles.favorAccionesRow}>
                <TouchableOpacity style={styles.favorAccionBtn} onPress={() => handleEditar(favor)}>
                  <Text style={styles.favorAccionText}>{t.profile.editar}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.favorAccionBtn} onPress={() => handleEliminar(favor)}>
                  <Text style={[styles.favorAccionText, styles.favorAccionTextEliminar]}>{t.profile.eliminar}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        {misPublicaciones.length === 0 && (
          <Text style={styles.sinPublicaciones}>{t.profile.sinPublicaciones}</Text>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>{t.profile.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 40,
  },
  nombre: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  email: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statNumero: {
    fontSize: 24,
    fontWeight: '800',
    color: '#e11d48',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  favorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  favorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  favorTitulo: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  tipoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  favorDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  favorAccionesRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
    paddingTop: 12,
  },
  favorAccionBtn: {
    paddingVertical: 4,
  },
  favorAccionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e11d48',
  },
  favorAccionTextEliminar: {
    color: '#ef4444',
  },
  sinPublicaciones: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: '#fef2f2',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
  },
});
