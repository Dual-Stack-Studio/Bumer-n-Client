import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';

export default function WelcomeScreen({ navigation }: any) {
  const { t } = useLanguage();
  const throwAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(throwAnim, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 550,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(throwAnim, {
          toValue: 0,
          duration: 650,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(spinAnim, {
          toValue: 2,
          duration: 650,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const translateX = throwAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 90],
  });
  const rotate = spinAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '360deg', '720deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Formas decorativas de fondo */}
      <View style={styles.blobSage} />
      <View style={styles.blobCoral} />

      <View style={styles.container}>

        <View style={styles.logoBadge}>
          <Animated.Text
            style={[styles.logoIcon, { transform: [{ translateX }, { rotate }] }]}
          >
            🪃
          </Animated.Text>
        </View>

        <Text style={styles.title}>{t.welcome.title}</Text>
        <Text style={styles.subtitle}>
          {t.welcome.subtitle}
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Main', { intencion: 'necesito' })}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>{t.welcome.needFavor}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Main', { intencion: 'ofrezco' })}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>{t.welcome.wantToHelp}</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffaf5',
    overflow: 'hidden',
  },
  blobCoral: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#fde0d6',
    top: -80,
    right: -80,
  },
  blobSage: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#dff3ea',
    bottom: -60,
    left: -70,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#f97362',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#f97362',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logoIcon: {
    fontSize: 44,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#92785f',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#f97362',
    paddingVertical: 18,
    borderRadius: 18,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#f97362',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#e6f7f1',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfe8d9',
  },
  secondaryButtonText: {
    color: '#1f8a64',
    fontSize: 17,
    fontWeight: '800',
  },
});
