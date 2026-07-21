import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const PRIVACY_URL = 'https://dual-stack-studio.github.io/App-cadenas-de-favores-client/privacidad';
const TERMS_URL   = 'https://dual-stack-studio.github.io/App-cadenas-de-favores-client/terminos';
const CONTACT_EMAIL = 'bumeran.tester@gmail.com';
const YEAR = new Date().getFullYear();

const open = (url: string) => Linking.openURL(url).catch(() => {});

export default function FooterLegal() {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoBadge}>
        <Text style={styles.logoIcon}>🪃</Text>
      </View>
      <Text style={styles.brand}>{t.common.appName}</Text>
      <Text style={styles.tagline}>{t.welcome.subtitle}</Text>

      <View style={styles.divider} />

      {/* Fuentes de datos */}
      <Text style={styles.sectionTitle}>{t.footer.dataSourcesTitle}</Text>

      <View style={styles.row}>
        <Text style={styles.rowIcon}>🗺️</Text>
        <Text style={styles.rowText}>
          {t.footer.dataSourceMap}{' '}
          <Text style={styles.link} onPress={() => open('https://maps.google.com/intl/en_us/help/terms_maps.html')}>
            {t.footer.dataSourceMapLink}
          </Text>
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowIcon}>🔐</Text>
        <Text style={styles.rowText}>
          {t.footer.dataSourceAuth}{' '}
          <Text style={styles.link} onPress={() => open('https://policies.google.com/privacy')}>
            {t.footer.dataSourceAuthLink}
          </Text>
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowIcon}>💬</Text>
        <Text style={styles.rowText}>
          {t.footer.dataSourceContact}{' '}
          <Text style={styles.link} onPress={() => open('https://www.whatsapp.com/legal/privacy-policy')}>
            {t.footer.dataSourceContactLink}
          </Text>
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Privacidad RGPD */}
      <Text style={styles.sectionTitle}>{t.footer.privacyTitle}</Text>

      <Text style={styles.gdprText}>{t.footer.privacyText}</Text>

      <Text style={styles.gdprText}>
        {t.footer.gdprBefore}{' '}
        <Text style={styles.bold}>{t.footer.gdprRights}</Text>
        {' '}{t.footer.gdprAfter}
      </Text>

      <Text style={styles.link} onPress={() => open(`mailto:${CONTACT_EMAIL}`)}>
        {CONTACT_EMAIL}
      </Text>

      <Text style={[styles.gdprText, { marginTop: 10 }]}>{t.footer.dpaText}</Text>

      {/* Botones legales */}
      <View style={styles.legalRow}>
        <TouchableOpacity style={styles.legalBtn} onPress={() => open(PRIVACY_URL)} activeOpacity={0.8}>
          <Text style={styles.legalBtnText}>{t.footer.privacyPolicy}</Text>
        </TouchableOpacity>
        <View style={styles.dot} />
        <TouchableOpacity style={styles.legalBtn} onPress={() => open(TERMS_URL)} activeOpacity={0.8}>
          <Text style={styles.legalBtnText}>{t.footer.termsOfUse}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <Text style={styles.copyright}>© {YEAR} Bumerán · Dual-Stack Studio</Text>
      <Text style={styles.compliance}>{t.footer.gdprCompliant}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 8,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f97362',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#f97362',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logoIcon: {
    fontSize: 30,
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.2,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    alignSelf: 'stretch',
  },
  rowIcon: {
    fontSize: 13,
    marginRight: 8,
    marginTop: 1,
    width: 18,
  },
  rowText: {
    flex: 1,
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
  },
  link: {
    color: '#e11d48',
    fontWeight: '600',
    fontSize: 13,
  },
  gdprText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
    alignSelf: 'stretch',
  },
  bold: {
    fontWeight: '700',
    color: '#1e293b',
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  legalBtn: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
  },
  legalBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
  },
  copyright: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 4,
    textAlign: 'center',
  },
  compliance: {
    fontSize: 10,
    color: '#cbd5e1',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
