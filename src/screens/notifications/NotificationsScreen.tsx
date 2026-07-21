import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  getMisNotificaciones,
  marcarTodasLeidas,
  Notificacion,
} from '../../api/notificacionesApi';
import FooterLegal from '../../components/FooterLegal';

const ICONOS: Record<string, string> = {
  conexion_nueva:      '💬',
  conexion_aceptada:   '🎉',
  conexion_completada: '✅',
  conexion_cancelada:  '❌',
};

function tiempoRelativo(fecha: string): string {
  const diff = Date.now() - new Date(fecha).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1)   return 'Ahora';
  if (min < 60)  return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24)    return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1)   return 'Ayer';
  return `Hace ${d} días`;
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { token } = useAuth();
  const { t } = useLanguage();

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!token) { setCargando(false); return; }

      setCargando(true);
      getMisNotificaciones(token)
        .then((data) => {
          setNotificaciones(data);
          const hayNoLeidas = data.some((n) => !n.leida);
          if (hayNoLeidas) marcarTodasLeidas(token).catch(() => {});
        })
        .catch(() => setNotificaciones([]))
        .finally(() => setCargando(false));
    }, [token])
  );

  const handleTap = (item: Notificacion) => {
    if (item.payload?.favorId) {
      navigation.navigate('Main');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.notifications.title}</Text>
        <View style={styles.backButton} />
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#e11d48" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={notificaciones}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 16 },
          ]}
          ListFooterComponent={<FooterLegal />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyTitle}>{t.notifications.emptyTitle}</Text>
              <Text style={styles.emptyText}>{t.notifications.emptyText}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={item.payload?.favorId ? 0.7 : 1}
              onPress={() => handleTap(item)}
            >
              <View style={[styles.card, !item.leida && styles.cardNoLeida]}>
                <Text style={styles.cardIcon}>
                  {ICONOS[item.tipo] ?? '🔔'}
                </Text>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitulo}>{item.titulo}</Text>
                  <Text style={styles.cardDesc}>{item.cuerpo}</Text>
                  <Text style={styles.cardFecha}>{tiempoRelativo(item.creadoEn)}</Text>
                </View>
                {!item.leida && <View style={styles.dot} />}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
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
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  backIcon: { fontSize: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  listContent: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardNoLeida: { backgroundColor: '#fffbeb', borderColor: '#fef3c7' },
  cardIcon: { fontSize: 24, marginRight: 12 },
  cardBody: { flex: 1 },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 6 },
  cardFecha: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#e11d48',
    marginLeft: 8, marginTop: 4,
  },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },
});
