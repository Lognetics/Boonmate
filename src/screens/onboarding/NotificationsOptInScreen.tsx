import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OnboardingFrame from './_shared';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';
import { firebaseEnabled } from '@/services/firebase';
import GradientButton from '@/components/GradientButton';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotificationsOptInScreen() {
  const { t } = useT();
  const { theme } = useTheme();
  const setDraft = useAuthStore((s) => s.setDraft);
  const finish = useAuthStore((s) => s.finishOnboarding);
  const signUp = useAuthStore((s) => s.signUp);
  const [busy, setBusy] = useState(false);

  const done = async (enable: boolean) => {
    setBusy(true);
    try {
      setDraft({ notifications: enable });
      const draft: any = useAuthStore.getState().draft;
      if (firebaseEnabled() && draft._email && draft._password) {
        await signUp(draft._email, draft._password);
      } else {
        await finish();
      }
    } catch (e: any) {
      Alert.alert('Sign-up failed', useAuthStore.getState().authError ?? e?.message ?? 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <OnboardingFrame
      step={10}
      total={10}
      title={t('onboarding.notifications')}
      caption={t('onboarding.notifications_sub')}
      primary={t('onboarding.enable_notifications')}
      onPrimary={() => done(true)}
      secondary={t('onboarding.maybe_later')}
      onSecondary={() => done(false)}
    >
      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 24 }}>
        <LinearGradient colors={theme.primaryGradient} style={styles.bell}>
          <Ionicons name="notifications" size={48} color="#fff" />
        </LinearGradient>
      </View>
      <View style={{ gap: 12 }}>
        <Bullet icon="chatbubble-ellipses" text="Friend pings and circle replies." />
        <Bullet icon="people" text="When new people in your circles join." />
        <Bullet icon="calendar" text="Hangouts and events near you." />
      </View>
    </OnboardingFrame>
  );
}

function Bullet({ icon, text }: { icon: any; text: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.bRow}>
      <View style={[styles.bIcon, { backgroundColor: theme.primarySoft }]}>
        <Ionicons name={icon} size={16} color={theme.primary} />
      </View>
      <Text style={{ color: theme.text, flex: 1 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bell: { width: 92, height: 92, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  bRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
