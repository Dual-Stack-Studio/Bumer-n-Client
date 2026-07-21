import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { enviarCodigo, confirmarCodigo } from '../../api/verificacionApi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

type Paso = 'telefono' | 'codigo' | 'exito';

export default function VerificacionTelefonoScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { token, usuario, refrescarUsuario } = useAuth();
  const { t } = useLanguage();

  const [paso, setPaso] = useState<Paso>('telefono');
  const [telefono, setTelefono] = useState(usuario?.telefono ?? '');
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleEnviarCodigo = async () => {
    if (!telefono.trim()) return;
    setCargando(true);
    try {
      const res = await enviarCodigo(telefono.trim(), token ?? '');
      // En dev el backend devuelve el código; mostrarlo para pruebas
      if (res.codigo) {
        Alert.alert('Código (solo en dev)', `Tu código: ${res.codigo}`);
      }
      setPaso('codigo');
    } catch (e: any) {
      Alert.alert('Error', t.verificacion.errorSend);
    } finally {
      setCargando(false);
    }
  };

  const handleVerificar = async () => {
    if (codigo.length !== 6) return;
    setCargando(true);
    try {
      await confirmarCodigo(codigo.trim(), token ?? '');
      await refrescarUsuario();
      setPaso('exito');
    } catch (e: any) {
      Alert.alert('Error', t.verificacion.errorVerify);
    } finally {
      setCargando(false);
    }
  };

  if (paso === 'exito') {
    return (
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 24) }]}>
        <View style={styles.exitoContainer}>
          <Text style={styles.exitoIcon}>✅</Text>
          <Text style={styles.exitoTitle}>{t.verificacion.successTitle}</Text>
          <Text style={styles.exitoSubtitle}>{t.verificacion.successSubtitle}</Text>
          <TouchableOpacity
            style={[styles.primaryButton, { alignSelf: 'stretch' }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>{t.verificacion.continuarBtn}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{t.verificacion.title}</Text>
        <Text style={styles.subtitle}>{t.verificacion.subtitle}</Text>

        {paso === 'telefono' && (
          <>
            <Text style={styles.label}>{t.verificacion.phoneLabel}</Text>
            <TextInput
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              placeholder={t.verificacion.phonePlaceholder}
              keyboardType="phone-pad"
              autoFocus
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
              style={[styles.primaryButton, (!telefono.trim() || cargando) && styles.disabled]}
              onPress={handleEnviarCodigo}
              disabled={!telefono.trim() || cargando}
            >
              <Text style={styles.primaryButtonText}>
                {cargando ? t.verificacion.sending : t.verificacion.sendCode}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {paso === 'codigo' && (
          <>
            <Text style={styles.label}>{t.verificacion.codeLabel}</Text>
            <TextInput
              style={[styles.input, styles.inputCodigo]}
              value={codigo}
              onChangeText={(v) => setCodigo(v.replace(/\D/g, '').slice(0, 6))}
              placeholder={t.verificacion.codePlaceholder}
              keyboardType="number-pad"
              autoFocus
              maxLength={6}
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
              style={[styles.primaryButton, (codigo.length !== 6 || cargando) && styles.disabled]}
              onPress={handleVerificar}
              disabled={codigo.length !== 6 || cargando}
            >
              <Text style={styles.primaryButtonText}>
                {cargando ? t.verificacion.verifying : t.verificacion.verify}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => { setCodigo(''); setPaso('telefono'); }}
            >
              <Text style={styles.resendText}>{t.verificacion.resend}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    marginBottom: 24,
  },
  backIcon: { fontSize: 16 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 24,
    backgroundColor: '#f8fafc',
  },
  inputCodigo: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
  },
  primaryButton: {
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
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendText: {
    color: '#e11d48',
    fontSize: 14,
    fontWeight: '600',
  },
  exitoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  exitoIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  exitoTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
  },
  exitoSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
});
