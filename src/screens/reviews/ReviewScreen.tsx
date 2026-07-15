import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { crearReview, getReviewsDeUsuario } from '../../api/reviewsApi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

type ReviewRouteProp = RouteProp<RootStackParamList, 'Review'>;

const TIPO_COLOR: Record<string, { bg: string; text: string; label: string }> = {
  necesito: { bg: '#fff7ed', text: '#c2410c', label: 'Necesito' },
  ofrezco: { bg: '#f0fdf4', text: '#15803d', label: 'Ofrezco' },
  regalo: { bg: '#eff6ff', text: '#1d4ed8', label: 'Regalo' },
};

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<ReviewRouteProp>();
  const { favor } = route.params;
  const { usuario, token, usuarioId } = useAuth();
  const { t } = useLanguage();

  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [yaRevisado, setYaRevisado] = useState(false);

  // Verificar si ya existe una reseña de este usuario para este favor
  useEffect(() => {
    if (!token || !usuarioId) return;
    getReviewsDeUsuario(favor.userId ?? '')
      .then((reviews) => {
        const yaReview = reviews.some(
          (r: any) => r.favorId === favor.id && r.autor?.id === usuarioId,
        );
        setYaRevisado(yaReview);
      })
      .catch(() => {});
  }, [favor.id, favor.userId, token, usuarioId]);

  const handleEnviar = async () => {
    if (estrellas === 0) {
      Alert.alert(t.reviews.errorTitle, t.reviews.errorNoStars);
      return;
    }
    if (!token || !favor.userId) {
      Alert.alert(t.reviews.errorTitle, t.reviews.errorSave);
      return;
    }
    setEnviando(true);
    try {
      await crearReview(
        {
          favorId: favor.id,
          destinatarioId: favor.userId,
          estrellas,
          comentario: comentario.trim() || undefined,
        },
        token,
      );
      setEnviado(true);
    } catch (e: any) {
      Alert.alert(t.reviews.errorTitle, e.message || t.reviews.errorSave);
    } finally {
      setEnviando(false);
    }
  };

  const tipoBadge = TIPO_COLOR[favor.tipo] ?? TIPO_COLOR.necesito;

  if (enviado) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>{t.reviews.successTitle}</Text>
        <Text style={styles.successSubtitle}>{t.reviews.successSubtitle}</Text>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.doneButtonText}>{t.reviews.done}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.reviews.title}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 80 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {yaRevisado && (
          <View style={styles.alreadyBanner}>
            <Text style={styles.alreadyText}>{t.reviews.alreadyReviewed}</Text>
          </View>
        )}

        <View style={styles.favorCard}>
          <View style={[styles.tipoBadge, { backgroundColor: tipoBadge.bg }]}>
            <Text style={[styles.tipoBadgeText, { color: tipoBadge.text }]}>
              {tipoBadge.label}
            </Text>
          </View>
          <Text style={styles.favorTitulo} numberOfLines={2}>{favor.titulo}</Text>
          <Text style={styles.favorCategoria}>{favor.categoria}</Text>
        </View>

        <Text style={styles.pregunta}>{t.reviews.question}</Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setEstrellas(n)}
              activeOpacity={0.7}
              style={styles.starButton}
            >
              <Text style={[styles.star, n <= estrellas && styles.starActive]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {estrellas > 0 && (
          <Text style={styles.starLabel}>{getStarLabel(estrellas, t)}</Text>
        )}

        <Text style={styles.comentarioLabel}>{t.reviews.commentLabel}</Text>
        <TextInput
          style={styles.comentarioInput}
          placeholder={t.reviews.commentPlaceholder}
          placeholderTextColor="#94a3b8"
          value={comentario}
          onChangeText={setComentario}
          multiline
          maxLength={300}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{comentario.length}/300</Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={[styles.sendButton, (estrellas === 0 || enviando) && styles.sendButtonDisabled]}
          onPress={handleEnviar}
          disabled={estrellas === 0 || enviando}
          activeOpacity={0.8}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>{t.reviews.send}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getStarLabel(n: number, t: any): string {
  const labels = [
    t.reviews.star1,
    t.reviews.star2,
    t.reviews.star3,
    t.reviews.star4,
    t.reviews.star5,
  ];
  return labels[n - 1] ?? '';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  doneButton: {
    backgroundColor: '#e11d48',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
  alreadyBanner: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  alreadyText: {
    fontSize: 13,
    color: '#92400e',
    fontWeight: '600',
    textAlign: 'center',
  },
  favorCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  tipoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  tipoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  favorTitulo: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  favorCategoria: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  pregunta: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 44,
    color: '#e2e8f0',
  },
  starActive: {
    color: '#f59e0b',
  },
  starLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 28,
  },
  comentarioLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  comentarioInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    fontSize: 15,
    color: '#0f172a',
    minHeight: 120,
    lineHeight: 22,
  },
  charCount: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 6,
  },
  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  sendButton: {
    backgroundColor: '#e11d48',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#f1f5f9',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
