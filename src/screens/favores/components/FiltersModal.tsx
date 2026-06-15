import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../../../context/LanguageContext';
import { formatMessage } from '../../../i18n/format';
import type { Favor } from '../../../types/favor';
import type { Language } from '../../../i18n/translations';

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  tipoFiltro: Favor['tipo'][];
  onChangeTipo: (tipos: Favor['tipo'][]) => void;
  estadoFiltro: Favor['estado'][];
  onChangeEstado: (estados: Favor['estado'][]) => void;
  soloFavoritos: boolean;
  onChangeSoloFavoritos: (value: boolean) => void;
  resultCount: number;
  onClear: () => void;
}

export default function FiltersModal({
  visible,
  onClose,
  tipoFiltro,
  onChangeTipo,
  estadoFiltro,
  onChangeEstado,
  soloFavoritos,
  onChangeSoloFavoritos,
  resultCount,
  onClear,
}: FiltersModalProps) {
  const insets = useSafeAreaInsets();
  const { t, language, setLanguage } = useLanguage();

  const TIPOS: { id: Favor['tipo']; label: string }[] = [
    { id: 'necesito', label: t.detail.badgeNecesito },
    { id: 'ofrezco', label: t.detail.badgeOfrezco },
    { id: 'regalo', label: t.detail.badgeRegalo },
  ];

  const ESTADOS: { id: Favor['estado']; label: string }[] = [
    { id: 'abierto', label: t.favorHelpers.estadoActiva },
    { id: 'en_proceso', label: t.favorHelpers.estadoEnProceso },
    { id: 'cerrado', label: t.favorHelpers.estadoCompletada },
  ];

  const LANGUAGE_OPTIONS: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: t.language.spanish, flag: '🇪🇸' },
    { code: 'en', label: t.language.english, flag: '🇬🇧' },
    { code: 'de', label: t.language.german, flag: '🇩🇪' },
  ];

  const toggleTipo = (tipo: Favor['tipo']) => {
    if (tipoFiltro.includes(tipo)) {
      onChangeTipo(tipoFiltro.filter((t2) => t2 !== tipo));
    } else {
      onChangeTipo([...tipoFiltro, tipo]);
    }
  };

  const toggleEstado = (estado: Favor['estado']) => {
    if (estadoFiltro.includes(estado)) {
      onChangeEstado(estadoFiltro.filter((e2) => e2 !== estado));
    } else {
      onChangeEstado([...estadoFiltro, estado]);
    }
  };

  const hayFiltrosActivos =
    tipoFiltro.length > 0 || estadoFiltro.length > 0 || soloFavoritos;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>{t.filters.title}</Text>
                {hayFiltrosActivos && (
                  <TouchableOpacity onPress={onClear}>
                    <Text style={styles.clearText}>{t.filters.clear}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                <Text style={styles.sectionTitle}>{t.filters.tipoTitle}</Text>
                <View style={styles.pillsRow}>
                  {TIPOS.map((tipo) => {
                    const isActive = tipoFiltro.includes(tipo.id);
                    return (
                      <TouchableOpacity
                        key={tipo.id}
                        style={[styles.pill, isActive && styles.pillActive]}
                        onPress={() => toggleTipo(tipo.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                          {tipo.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.sectionTitle}>{t.filters.estadoTitle}</Text>
                <View style={styles.pillsRow}>
                  {ESTADOS.map((estado) => {
                    const isActive = estadoFiltro.includes(estado.id);
                    return (
                      <TouchableOpacity
                        key={estado.id}
                        style={[styles.pill, isActive && styles.pillActive]}
                        onPress={() => toggleEstado(estado.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                          {estado.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.sectionTitle}>{t.filters.myFavoritesTitle}</Text>
                <View style={styles.pillsRow}>
                  <TouchableOpacity
                    style={[styles.pill, soloFavoritos && styles.pillActive]}
                    onPress={() => onChangeSoloFavoritos(!soloFavoritos)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pillText, soloFavoritos && styles.pillTextActive]}>
                      ❤️ {t.filters.onlyFavorites}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>{t.language.title}</Text>
                <View style={styles.pillsRow}>
                  {LANGUAGE_OPTIONS.map((option) => {
                    const isActive = language === option.code;
                    return (
                      <TouchableOpacity
                        key={option.code}
                        style={[styles.pill, isActive && styles.pillActive]}
                        onPress={() => setLanguage(option.code)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                          {option.flag} {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <TouchableOpacity style={styles.applyButton} onPress={onClose} activeOpacity={0.85}>
                  <Text style={styles.applyButtonText}>
                    {formatMessage(
                      resultCount === 1 ? t.filters.showResult : t.filters.showResults,
                      { count: resultCount }
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f97362',
  },
  scroll: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 10,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pillActive: {
    backgroundColor: '#f97362',
    borderColor: '#f97362',
  },
  pillText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  applyButton: {
    backgroundColor: '#1e293b',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
