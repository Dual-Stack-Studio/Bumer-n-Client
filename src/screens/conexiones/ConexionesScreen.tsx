import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Image, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  getMisConexiones, aceptarConexion, completarConexion, cancelarConexion,
} from '../../api/conexionesApi';
import type { Conexion } from '../../api/conexionesApi';

type Tab = 'recibidas' | 'enviadas';

const ESTADO_COLORS: Record<Conexion['estado'], { bg: string; text: string }> = {
  pendiente:  { bg: '#fff7ed', text: '#c2410c' },
  aceptada:   { bg: '#f0fdf4', text: '#15803d' },
  completada: { bg: '#f8fafc', text: '#64748b' },
  cancelada:  { bg: '#fef2f2', text: '#dc2626' },
};

export default function ConexionesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { token, usuarioId } = useAuth();
  const { t } = useLanguage();

  const [tab, setTab] = useState<Tab>('recibidas');
  const [conexiones, setConexiones] = useState<Conexion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acting, setActing] = useState(false);

  const cargar = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getMisConexiones(token);
      setConexiones(data);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudieron cargar las conexiones.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const ejecutar = async (accion: () => Promise<Conexion>, errorMsg: string) => {
    if (acting) return;
    setActing(true);
    try {
      await accion();
      await cargar();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? errorMsg);
    } finally {
      setActing(false);
    }
  };

  const recibidas = conexiones.filter(c => c.solicitanteId === usuarioId);
  const enviadas  = conexiones.filter(c => c.ayudanteId === usuarioId);
  const lista = tab === 'recibidas' ? recibidas : enviadas;
  const pendientesCount = recibidas.filter(c => c.estado === 'pendiente').length;

  const renderItem = ({ item }: { item: Conexion }) => {
    const color = ESTADO_COLORS[item.estado];
    const esRecibida = tab === 'recibidas';
    const persona = esRecibida ? item.ayudante : item.solicitante;
    const estadoLabels: Record<Conexion['estado'], string> = {
      pendiente:  t.conexiones.estadoPendiente,
      aceptada:   t.conexiones.estadoAceptada,
      completada: t.conexiones.estadoCompletada,
      cancelada:  t.conexiones.estadoCancelada,
    };

    return (
      <View style={styles.card}>
        <Text style={styles.favorTitle} numberOfLines={1}>
          {item.favor?.titulo ?? '—'}
        </Text>

        {persona && (
          <View style={styles.personRow}>
            {persona.photo ? (
              <Image source={{ uri: persona.photo }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarFallbackText}>{persona.name?.[0] ?? '?'}</Text>
              </View>
            )}
            <View style={styles.personInfo}>
              <Text style={styles.personName}>{persona.name}</Text>
              {(persona as any).telefonoVerificado && (
                <Text style={styles.verifiedBadge}>✓ {t.conexiones.verificado}</Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.bottomRow}>
          <View style={[styles.estadoBadge, { backgroundColor: color.bg }]}>
            <Text style={[styles.estadoText, { color: color.text }]}>
              {estadoLabels[item.estado]}
            </Text>
          </View>

          <View style={styles.actionsRow}>
            {esRecibida && item.estado === 'pendiente' && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.btnAceptar]}
                disabled={acting}
                onPress={() => ejecutar(
                  () => aceptarConexion(item.id, token!),
                  t.conexiones.errorAceptar,
                )}
              >
                <Text style={styles.actionBtnText}>{t.conexiones.aceptar}</Text>
              </TouchableOpacity>
            )}

            {item.estado === 'aceptada' && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.btnCompletar]}
                disabled={acting}
                onPress={() => ejecutar(
                  () => completarConexion(item.id, token!),
                  t.conexiones.errorCompletar,
                )}
              >
                <Text style={styles.actionBtnText}>{t.conexiones.completar}</Text>
              </TouchableOpacity>
            )}

            {(item.estado === 'pendiente' || item.estado === 'aceptada') && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.btnCancelar]}
                disabled={acting}
                onPress={() =>
                  Alert.alert(t.conexiones.cancelarTitle, t.conexiones.cancelarMessage, [
                    { text: t.common.cancel, style: 'cancel' },
                    {
                      text: t.conexiones.cancelar,
                      style: 'destructive',
                      onPress: () => ejecutar(
                        () => cancelarConexion(item.id, token!),
                        t.conexiones.errorCancelar,
                      ),
                    },
                  ])
                }
              >
                <Text style={[styles.actionBtnText, styles.cancelText]}>
                  {t.conexiones.cancelar}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.conexiones.title}</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['recibidas', 'enviadas'] as Tab[]).map(tabKey => (
          <TouchableOpacity
            key={tabKey}
            style={[styles.tab, tab === tabKey && styles.tabActive]}
            onPress={() => setTab(tabKey)}
          >
            <Text style={[styles.tabText, tab === tabKey && styles.tabTextActive]}>
              {tabKey === 'recibidas'
                ? `${t.conexiones.tabRecibidas}${pendientesCount > 0 ? ` (${pendientesCount})` : ''}`
                : t.conexiones.tabEnviadas}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e11d48" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={lista}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={lista.length === 0 ? styles.emptyContainer : styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); cargar(); }}
              tintColor="#e11d48"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🤝</Text>
              <Text style={styles.emptyTitle}>{t.conexiones.emptyTitle}</Text>
              <Text style={styles.emptyText}>
                {tab === 'recibidas' ? t.conexiones.emptyRecibidas : t.conexiones.emptyEnviadas}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#e11d48' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#94a3b8' },
  tabTextActive: { color: '#e11d48' },
  listContent: { padding: 16, gap: 12 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  emptyBox: { alignItems: 'center', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 18, fontWeight: '700', color: '#0f172a',
    marginBottom: 8, textAlign: 'center',
  },
  emptyText: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  favorTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  personRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarFallback: {
    backgroundColor: '#fde0d6', justifyContent: 'center', alignItems: 'center',
  },
  avatarFallbackText: { fontSize: 16, fontWeight: '700', color: '#e11d48' },
  personInfo: { flex: 1 },
  personName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  verifiedBadge: { fontSize: 12, color: '#15803d', fontWeight: '600', marginTop: 2 },
  bottomRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
  },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  estadoText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnAceptar: { backgroundColor: '#e11d48' },
  btnCompletar: { backgroundColor: '#15803d' },
  btnCancelar: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca' },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  cancelText: { color: '#dc2626' },
});
