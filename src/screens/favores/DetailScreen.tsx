import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";
import { Favor } from "../../types/favor";
import { getEstadoBadge, getTiempoRestante, getWhatsappUrl } from "../../utils/favorHelpers";
import SafetyModal from "./components/SafetyModal";
import { useFavoritos } from "../../context/FavoritosContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { formatMessage } from "../../i18n/format";
import type { Translation } from "../../i18n/translations";

const getBotonTexto = (tipo: Favor["tipo"], t: Translation) => {
  switch (tipo) {
    case "necesito":
      return t.detail.offerHelp;
    case "ofrezco":
      return t.detail.requestThis;
    case "regalo":
      return t.detail.imInterested;
  }
};

const getTipoBadge = (tipo: Favor["tipo"], t: Translation) => {
  switch (tipo) {
    case "necesito":
      return { label: t.detail.badgeNecesito, bg: "#fff7ed", text: "#c2410c" };
    case "ofrezco":
      return { label: t.detail.badgeOfrezco, bg: "#f0fdf4", text: "#15803d" };
    case "regalo":
      return { label: t.detail.badgeRegalo, bg: "#eff6ff", text: "#1d4ed8" };
  }
};

export default function DetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, "Detail">>();
  const { favor } = route.params;
  const [showSafety, setShowSafety] = useState(false);
  const { esFavorito, toggleFavorito } = useFavoritos();
  const { t } = useLanguage();
  const { usuario } = useAuth();

  const handleConectar = () => {
    if (!usuario) {
      navigation.navigate('Login');
      return;
    }
    if (!usuario.telefonoVerificado) {
      Alert.alert(
        t.verificacion.title,
        t.verificacion.verificationRequired,
        [
          { text: t.common.cancel, style: 'cancel' },
          { text: t.verificacion.verifyNow, onPress: () => navigation.navigate('VerificacionTelefono') },
        ]
      );
      return;
    }
    setShowSafety(true);
  };

  const badge = getTipoBadge(favor.tipo, t);
  const estadoBadge = getEstadoBadge(favor, t);
  const imagenPlaceholder =
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop";
  const formatearFecha = (fechaISO: string) => {
    const ahora = new Date();
    const fecha = new Date(fechaISO);
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return t.detail.publishedToday;
    if (diffDias === 1) return t.detail.publishedYesterday;
    return formatMessage(t.detail.publishedDaysAgo, { days: diffDias });
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: favor.imagen || imagenPlaceholder }} style={styles.image} />
        <TouchableOpacity
          style={[styles.backButton, { top: Math.max(insets.top, 20) }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.favoritoButton, { top: Math.max(insets.top, 20) }]}
          onPress={() => toggleFavorito(favor.id)}
        >
          <Text style={styles.backIcon}>{esFavorito(favor.id) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* BADGES DE TIPO Y ESTADO */}
        <View style={styles.badgesRow}>
          <View style={[styles.tipoBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.tipoText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>
          <View style={[styles.tipoBadge, { backgroundColor: estadoBadge.bg }]}>
            <Text style={[styles.tipoText, { color: estadoBadge.text }]}>
              {estadoBadge.label}
            </Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.title}>{favor.titulo}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{favor.categoria}</Text>
          </View>
        </View>

        <View style={styles.locationBox}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>
            {favor.distancia
              ? formatMessage(t.detail.distanceFromYou, {
                  distance: favor.distancia < 1 ? Math.round(favor.distancia * 1000) + " m" : favor.distancia.toFixed(1) + " km",
                })
              : t.detail.hiddenLocation}
          </Text>
        </View>
        <View style={styles.fechaRow}>
          <Text style={styles.fechaText}>
            🕐 {formatearFecha(favor.creadoEn)}
          </Text>
          <Text style={styles.fechaText}>
            ⏳ {getTiempoRestante(favor, t)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{t.detail.details}</Text>
        <Text style={styles.description}>{favor.descripcion}</Text>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConectar}
        >
          <Text style={styles.primaryButtonText}>
            {getBotonTexto(favor.tipo, t)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Review', { favor })}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>{t.profile.calificar}</Text>
        </TouchableOpacity>
      </View>

      <SafetyModal
        visible={showSafety}
        onClose={() => setShowSafety(false)}
        onContinue={() => {
          setShowSafety(false);
          Linking.openURL(getWhatsappUrl(favor));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    height: "35%",
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backIcon: {
    fontSize: 18,
    marginLeft: -2,
  },
  favoritoButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  tipoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    flex: 1,
    marginRight: 16,
  },
  categoryBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: "#e11d48",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 40,
  },
  footer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: "#f1f5f9",
  },
  primaryButton: {
    backgroundColor: "#e11d48",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#e11d48",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#e11d48",
    fontSize: 14,
    fontWeight: "600",
  },
  fechaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  fechaText: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
