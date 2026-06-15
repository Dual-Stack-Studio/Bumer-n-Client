import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../../../context/LanguageContext';

interface SafetyModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function SafetyModal({ visible, onClose, onContinue }: SafetyModalProps) {
  const { t } = useLanguage();
  const consejos = [t.safety.tip1, t.safety.tip2, t.safety.tip3, t.safety.tip4];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.icon}>🛡️</Text>
          <Text style={styles.title}>{t.safety.title}</Text>
          <Text style={styles.subtitle}>
            {t.safety.subtitle}
          </Text>

          {consejos.map((consejo) => (
            <Text key={consejo} style={styles.consejo}>{consejo}</Text>
          ))}

          <TouchableOpacity style={styles.primaryButton} onPress={onContinue} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>{t.safety.continue}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>{t.safety.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
  },
  icon: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  consejo: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#e11d48',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});
