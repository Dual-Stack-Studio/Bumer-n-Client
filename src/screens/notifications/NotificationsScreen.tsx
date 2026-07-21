import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { getMockNotificaciones } from '../../data/mockNotificaciones';
import { useLanguage } from '../../context/LanguageContext';
import FooterLegal from '../../components/FooterLegal';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.notifications.title}</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={getMockNotificaciones(t)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}
        ListFooterComponent={<FooterLegal />}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.leida && styles.cardNoLeida]}>
            <Text style={styles.cardIcon}>{item.icono}</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitulo}>{item.titulo}</Text>
              <Text style={styles.cardDesc}>{item.descripcion}</Text>
              <Text style={styles.cardFecha}>{item.fecha}</Text>
            </View>
            {!item.leida && <View style={styles.dot} />}
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardNoLeida: {
    backgroundColor: '#fffbeb',
    borderColor: '#fef3c7',
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 6,
  },
  cardFecha: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e11d48',
    marginLeft: 8,
    marginTop: 4,
  },
});
