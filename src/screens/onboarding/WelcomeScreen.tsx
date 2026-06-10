import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '@/components/GradientButton';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.primaryGradient} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', paddingHorizontal: 28, paddingTop: 60 }}>
          <View style={styles.logo}>
            <Ionicons name="link" size={42} color="#fff" />
          </View>
          <Text style={styles.brand}>Boonmate</Text>
          <Text style={styles.tag}>{t('app.tagline')}</Text>
          <Text style={styles.welcome}>{t('onboarding.welcome_title')}</Text>
          <Text style={styles.sub}>{t('onboarding.welcome_sub')}</Text>
        </View>

        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)' }]} />
          ))}
        </View>

        <View style={{ paddingHorizontal: 22, paddingBottom: 36, gap: 12 }}>
          <GradientButton
            title={t('onboarding.get_started')}
            variant="soft"
            textStyle={{ color: theme.primary }}
            style={{ backgroundColor: '#fff' }}
            size="lg"
            onPress={() => nav.navigate('Language')}
          />
          <GradientButton
            title={t('onboarding.have_account')}
            variant="ghost"
            textStyle={{ color: '#fff' }}
            onPress={() => nav.navigate('Login')}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 84, height: 84, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  brand: { color: '#fff', fontSize: 38, fontWeight: '900', letterSpacing: 0.5 },
  tag: { color: 'rgba(255,255,255,0.85)', marginTop: 6, marginBottom: 36 },
  welcome: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  sub: { color: 'rgba(255,255,255,0.85)', marginTop: 8, fontSize: 15, textAlign: 'center' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
