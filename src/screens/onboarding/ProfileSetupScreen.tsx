import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OnboardingFrame from './_shared';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';
import Avatar from '@/components/Avatar';

export default function ProfileSetupScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const setDraft = useAuthStore((s) => s.setDraft);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const next = () => {
    setDraft({ name, bio });
    nav.navigate('Personality');
  };

  return (
    <OnboardingFrame
      step={2}
      total={10}
      title={t('onboarding.profile_setup')}
      caption={t('onboarding.profile_setup_sub')}
      primary={t('common.continue')}
      onPrimary={next}
      primaryDisabled={!name.trim()}
    >
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Avatar size={96} name={name || 'You'} ring />
        <Text style={{ color: theme.textMuted, marginTop: 10, fontSize: 12 }}>Tap profile to add a photo (after sign-up)</Text>
      </View>

      <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 6 }}>{t('onboarding.name')}</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your display name"
        placeholderTextColor={theme.textMuted}
        style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
      />

      <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 6, marginTop: 12 }}>{t('onboarding.bio')}</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="One line about you"
        placeholderTextColor={theme.textMuted}
        multiline
        style={[styles.input, { height: 88, color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
      />
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
});
