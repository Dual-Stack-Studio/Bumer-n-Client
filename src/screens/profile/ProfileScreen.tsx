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
import FooterLegal from '../../components/FooterLegal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { eliminarFavor, getFavores } from '../../api/favoresApi';
import { getReviewsDeUsuario } from '../../api/reviewsApi';
import { eliminarCuenta } from '../../api/usuariosApi';
import { useAuth } from '../../context/AuthContext';
import { Favor } from '../../types/favor';
import { Review } from '../../types/review';
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
  const { usuario, usuarioId, token, cerrarSesion } = useAuth();

  const [misPublicaciones, setMisPublicaciones] = useState<Favor[]>([]);
  const [resenias, setResenias] = useState<Review[]>([]);
  const favoresOfrecidos = misPublicaciones.filter((f) => f.tipo === 'ofrezco').length;
  const ratingPromedio = resenias.length
    ? (resenias.reduce((sum, r) => sum + r.estrellas, 0) / resenias.length).toFixed(1)
    : '—';

  useFocusEffect(
    useCallback(() => {
      if (!usuarioId) {
        setMisPublicaciones([]);
        return;
      }
      getFavores(language).then(setMisPublicaciones).catch(() => setMisPublicaciones([]));
      if (usuarioId) {
        getReviewsDeUsuario(usuarioId).then(setResenias).catch(() => setResenias([]));
      }
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
              await eliminarFavor(favor.id, token ?? '');
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

  const handleDeleteAccount = () => {
    Alert.alert(
      t.profile.deleteAccountTitle,
      t.profile.deleteAccountMessage,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.profile.deleteAccountConfirm,
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarCuenta(token ?? '');
              // Limpiar sesión local (best-effort en Google Sign-In)
              try {
                if (GoogleSignin.hasPreviousSignIn()) {
                  await GoogleSignin.revokeAccess();
                  await GoogleSignin.signOut();
                }
              } catch {}
              await cerrarSesion();
              Alert.alert('', t.profile.deleteAccountSuccess);
              navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
            } catch (error: any) {
              Alert.alert(t.profile.deleteAccountTitle, t.profile.deleteAccountError);
            }
          },
        },
      ]
    );
  };

  const avatarUri = usuario?.photo ?? undefined;
  const nombre = usuario?.name || t.profile.defaultName;
  const email = usuario?.email || '';

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

        {usuario && !usuario.telefonoVerificado && (
          <TouchableOpacity
            style={styles.verificationBanner}
            onPress={() => navigation.navigate('VerificacionTelefono')}
            activeOpacity={0.8}
          >
            <Text style={styles.verificationBannerIcon}>📱</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.verificationBannerText}>{t.verificacion.profileBannerText}</Text>
            </View>
            <Text style={styles.verificationBannerArrow}>›</Text>
          </TouchableOpacity>
        )}
        {usuario?.telefonoVerificado && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeText}>{t.verificacion.verifiedBadge}</Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumero}>{misPublicaciones.length}</Text>
            <Text style={styles.statLabel}>{t.profile.misSolicitudes}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumero}>{favoresOfrecidos}</Text>
            <Text style={styles.statLabel}>{t.profile.favoresOfrecidos}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumero}>⭐ {ratingPromedio}</Text>
            <Text style={styles.statLabel}>{t.profile.valoracion}</Text>
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

        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>{t.profile.reseniasRecibidas}</Text>
        {resenias.length === 0 ? (
          <Text style={styles.sinPublicaciones}>{t.profile.sinResenias}</Text>
        ) : (
          resenias.map((r) => (
            <View key={r.id} style={styles.reseniaCard}>
              <View style={styles.reseniaHeader}>
                <View style={styles.reseniaAvatar}>
                  <Text style={styles.reseniaAvatarText}>
                    {r.autorNombre.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reseniaAutor}>{r.autorNombre}</Text>
                  <Text style={styles.reseniaFavor} numberOfLines={1}>{r.favorTitulo}</Text>
                </View>
                <View style={styles.reseniaEstrellas}>
                  <Text style={styles.reseniaEstrellasText}>
                    {'★'.repeat(r.estrellas)}{'☆'.repeat(5 - r.estrellas)}
                  </Text>
                </View>
              </View>
              {r.comentario ? (
                <Text style={styles.reseniaComentario}>{r.comentario}</Text>
              ) : null}
              <Text style={styles.reseniaFecha}>
                {new Date(r.creadoEn).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>{t.profile.logout}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount} activeOpacity={0.8}>
          <Text style={styles.deleteAccountButtonText}>{t.profile.deleteAccount}</Text>
        </TouchableOpacity>

        <FooterLegal />
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
  deleteAccountButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  deleteAccountButtonText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  reseniaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  reseniaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reseniaAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reseniaAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e11d48',
  },
  reseniaAutor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  reseniaFavor: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  reseniaEstrellas: {
    alignSelf: 'flex-start',
  },
  reseniaEstrellasText: {
    fontSize: 14,
    color: '#f59e0b',
    letterSpacing: 1,
  },
  reseniaComentario: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 6,
  },
  reseniaFecha: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },

  // ── FOOTER GDPR ───────────────────────────────────────────────
  footerDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  footerSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  footerIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  footerLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  footerLink: {
    fontSize: 13,
    color: '#e11d48',
    fontWeight: '600',
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 6,
  },
  footerBold: {
    fontWeight: '700',
    color: '#1e293b',
  },
  footerButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    marginBottom: 16,
  },
  footerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  footerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  footerCopyright: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerCompliance: {
    fontSize: 10,
    color: '#cbd5e1',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fed7aa',
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  verificationBannerIcon: {
    fontSize: 20,
  },
  verificationBannerText: {
    fontSize: 13,
    color: '#c2410c',
    fontWeight: '600',
    lineHeight: 18,
  },
  verificationBannerArrow: {
    fontSize: 20,
    color: '#c2410c',
    fontWeight: '700',
  },
  verifiedBadge: {
    alignSelf: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 16,
  },
  verifiedBadgeText: {
    fontSize: 13,
    color: '#15803d',
    fontWeight: '700',
  },
});
