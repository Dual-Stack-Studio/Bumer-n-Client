import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Importamos la librería nativa de inicio de sesión
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// 1. Añadimos 'route' para poder recibir los parámetros de navegación
export default function LoginScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();

  // 2. Extraemos el destino si es que venimos redirigidos (ej. desde el botón "Pedir")
  const { redirectTo } = route?.params || {};

  // 3. Función encargada de disparar el flujo nativo
  const iniciarSesionConGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Recibimos la respuesta completa del inicio de sesión
      const response = await GoogleSignin.signIn();
      
      // Extraemos el usuario accediendo de forma segura a response.data
      const nombreUsuario = response.data?.user?.name;
      
      alert(`¡Hola, ${nombreUsuario || 'Vecino'}! Login exitoso.`);
      console.log('Usuario de Google detectado:', response.data);
      
      // 4. LÓGICA DE REDIRECCIÓN INTELIGENTE
      if (redirectTo) {
        // Si veníamos de intentar una acción bloqueada, lo mandamos directo allá
        navigation.navigate(redirectTo);
      } else {
        // Si entró al login por su cuenta (ej. botón de perfil), solo volvemos atrás
        navigation.goBack();
      }

    } catch (error: any) {
      alert("Error de Google: " + error.message);
      console.log("Error detallado:", JSON.stringify(error));
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      
      {/* Botón para cerrar/saltar el login y mantener la fricción baja */}
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Ilustración o Icono principal */}
        <View style={styles.iconContainer}>
          <Text style={styles.mainIcon}>🤝</Text>
        </View>

        <Text style={styles.title}>Únete a la comunidad</Text>
        <Text style={styles.subtitle}>
          Inicia sesión para pedir ayuda, ofrecer favores y conectarte con tus vecinos.
        </Text>

        {/* Botón de Google conectado */}
        <TouchableOpacity 
          style={styles.googleButton} 
          activeOpacity={0.8}
          onPress={iniciarSesionConGoogle}
        >
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' }} 
            style={styles.googleIcon} 
          />
          <Text style={styles.googleButtonText}>Continuar con Google</Text>
        </TouchableOpacity>

        {/* Botón alternativo (Apple / Email) por si acaso */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity style={styles.appleButton} activeOpacity={0.8}>
            <Text style={styles.appleIcon}></Text>
            <Text style={styles.appleButtonText}>Continuar con Apple</Text>
          </TouchableOpacity>
        )}

        {/* Recordatorio de privacidad o términos */}
        <Text style={styles.footerText}>
          Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 20,
    marginRight: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#64748b',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  iconContainer: {
    backgroundColor: '#ccfbf1',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  mainIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    marginBottom: 16,
  },
  appleIcon: {
    fontSize: 22,
    color: '#ffffff',
    marginRight: 8,
    marginTop: -4,
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  footerText: {
    marginTop: 32,
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  }
});