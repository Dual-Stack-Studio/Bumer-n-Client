import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { getFavores } from '../../api/favoresApi';
import { useFavoritos } from '../../context/FavoritosContext';
import { Favor } from '../../types/favor';
import { getEstadoBadge, getTiempoRestante } from '../../utils/favorHelpers';
import { useLanguage } from '../../context/LanguageContext';
import FooterLegal from '../../components/FooterLegal';

export default function FavoritosScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { t, language } = useLanguage();
  const { favoritos, toggleFavorito } = useFavoritos();
  const [favores, setFavores] = useState<Favor[]>([]);

  useFocusEffect(
    useCallback(() => {
      getFavores(language).then(setFavores).catch(() => setFavores([]));
    }, [language])
  );

  const favoritosFavores = favores.filter((favor) => favoritos.includes(favor.id));

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.favoritos.title}</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={favoritosFavores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}
        ListFooterComponent={<FooterLegal />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>{t.favoritos.emptyTitle}</Text>
            <Text style={styles.emptyText}>
              {t.favoritos.emptyText}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const estadoBadge = getEstadoBadge(item, t);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Detail', { favor: item })}
            >
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
                  <TouchableOpacity onPress={() => toggleFavorito(item.id)}>
                    <Text style={styles.heartIcon}>❤️</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.badgesRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.categoria}</Text>
                  </View>
                  <View style={[styles.estadoBadge, { backgroundColor: estadoBadge.bg }]}>
                    <Text style={[styles.estadoText, { color: estadoBadge.text }]}>{estadoBadge.label}</Text>
                  </View>
                  <Text style={styles.expiraText}>⏳ {getTiempoRestante(item, t)}</Text>
                </View>
                <Text style={styles.cardDesc} numberOfLines={2}>{item.descripcion}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  heartIcon: {
    fontSize: 18,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#e11d48',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  expiraText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  cardDesc: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
