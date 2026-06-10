import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import { firebaseEnabled } from '@/services/firebase';
import { seedDemoData } from '@/services/seed';

export default function SettingsScreen() {
  const { theme, isDark, toggle, lowStimulation, setLowStimulation } = useTheme();
  const { t } = useT();
  const { i18n } = useTranslation();
  const nav = useNavigation<any>();
  const { plan, anonymous, setAnonymous, isFeatureAllowed } = useSubscriptionStore();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [seeding, setSeeding] = useState(false);

  const curLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0]!;

  const onSeed = async () => {
    if (!firebaseEnabled()) {
      Alert.alert('Firebase not configured', 'Add your Firebase keys to .env and restart with `npx expo start -c`. The mock data is already there until then.');
      return;
    }
    Alert.alert(
      'Seed demo data?',
      'This will write demo users, circles, and posts to your Firestore. Safe to run multiple times — it merges.',
      [
        { text: 'Cancel' },
        {
          text: 'Seed',
          onPress: async () => {
            setSeeding(true);
            try {
              const r = await seedDemoData(user);
              Alert.alert('Done', `Wrote ${r.users} users, ${r.circles} circles, ${r.posts} posts.`);
            } catch (e: any) {
              Alert.alert('Seed failed', e?.message ?? 'Check your Firestore rules — test mode should allow writes.');
            } finally {
              setSeeding(false);
            }
          },
        },
      ],
    );
  };

  const onAnon = (v: boolean) => {
    if (v && !isFeatureAllowed('anonymous')) {
      Alert.alert('Pro plan needed', 'Anonymous mode is part of the Pro plan.', [
        { text: 'Maybe later' },
        { text: 'Upgrade', onPress: () => nav.navigate('Subscription') },
      ]);
      return;
    }
    setAnonymous(v);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScreenHeader title={t('settings.title')} back />
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80 }}>
        <SectionLabel label={t('settings.preferences')} />
        <Card style={{ padding: 0 }}>
          <Row icon="globe-outline" label={t('settings.language')} trailing={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: theme.textMuted }}>{curLang.flag} {curLang.native}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </View>
          } onPress={() => nav.navigate('LanguagePicker')} />
          <Divider />
          <Row icon={isDark ? 'sunny-outline' : 'moon-outline'} label={isDark ? t('settings.light_mode') : t('settings.dark_mode')} onPress={toggle} />
        </Card>

        <SectionLabel label={t('settings.privacy')} />
        <Card style={{ padding: 0 }}>
          <Row icon="eye-off-outline" label={t('settings.anonymous')} caption={t('settings.anonymous_sub')} trailing={<Switch value={anonymous} onValueChange={onAnon} trackColor={{ true: theme.primary, false: theme.border }} />} />
          <Divider />
          <Row icon="shield-outline" label={t('settings.privacy_policy')} onPress={() => Alert.alert('Privacy Policy', 'Demo placeholder')} />
        </Card>

        <SectionLabel label={t('settings.accessibility')} />
        <Card style={{ padding: 0 }}>
          <Row icon="leaf-outline" label={t('settings.neurodiversity_mode')} caption={t('settings.neurodiversity_mode_sub')} onPress={() => nav.navigate('NeurodiversityHub')} />
          <Divider />
          <Row icon="accessibility-outline" label={t('settings.low_stim')} caption={t('settings.low_stim_sub')} trailing={<Switch value={lowStimulation} onValueChange={setLowStimulation} trackColor={{ true: theme.primary, false: theme.border }} />} />
        </Card>

        <SectionLabel label={t('settings.subscription')} />
        <Card style={{ padding: 0 }}>
          <Row icon="card-outline" label={t('settings.current_plan')} trailing={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: theme.textMuted }}>🚀 {plan.charAt(0).toUpperCase() + plan.slice(1)} ($10/mo)</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </View>
          } onPress={() => nav.navigate('Subscription')} />
          <Divider />
          <Row icon="flash-outline" label={t('settings.upgrade')} onPress={() => nav.navigate('Subscription')} />
        </Card>

        <SectionLabel label={t('settings.support')} />
        <Card style={{ padding: 0 }}>
          <Row icon="notifications-outline" label={t('settings.notifications')} onPress={() => nav.navigate('Notifications')} />
          <Divider />
          <Row icon="shield-checkmark-outline" label={t('settings.report')} onPress={() => Alert.alert('Report', 'Demo placeholder')} />
        </Card>

        <SectionLabel label="Developer" />
        <Card style={{ padding: 0 }}>
          <Row
            icon="cloud-upload-outline"
            label="Seed demo data to Firestore"
            caption={firebaseEnabled() ? 'Pushes the demo users, circles, and posts to your DB.' : 'Add Firebase keys to .env first.'}
            trailing={seeding ? <ActivityIndicator color={theme.primary} /> : <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />}
            onPress={onSeed}
          />
          <Divider />
          <Row
            icon="information-circle-outline"
            label="Firebase status"
            trailing={
              <Text style={{ color: firebaseEnabled() ? theme.success : theme.warning, fontWeight: '700' }}>
                {firebaseEnabled() ? '● Connected' : '● Mock mode'}
              </Text>
            }
          />
        </Card>

        <View style={{ marginTop: 24 }}>
          <TouchableOpacity onPress={signOut} style={[styles.logout, { borderColor: theme.danger }]}>
            <Ionicons name="log-out-outline" size={18} color={theme.danger} />
            <Text style={{ color: theme.danger, fontWeight: '700', marginLeft: 8 }}>{t('settings.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ label }: { label: string }) {
  const { theme } = useTheme();
  return <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginTop: 22, marginBottom: 8 }}>{label.toUpperCase()}</Text>;
}

function Row({ icon, label, caption, trailing, onPress }: { icon: any; label: string; caption?: string; trailing?: React.ReactNode; onPress?: () => void }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress} style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: theme.primarySoft }]}>
        <Ionicons name={icon} size={18} color={theme.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: theme.text, fontWeight: '700' }}>{label}</Text>
        {caption ? <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>{caption}</Text> : null}
      </View>
      {trailing}
    </TouchableOpacity>
  );
}

function Divider() {
  const { theme } = useTheme();
  return <View style={{ height: 1, backgroundColor: theme.border, marginLeft: 56 }} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  rowIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logout: { borderWidth: 1, borderRadius: 14, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
});
