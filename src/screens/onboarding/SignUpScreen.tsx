import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeContext';
import GradientButton from '@/components/GradientButton';
import { useAuthStore } from '@/store/authStore';
import { firebaseEnabled } from '@/services/firebase';
import { useT } from '@/hooks/useT';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const setDraft = useAuthStore((s) => s.setDraft);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || password.length < 6) {
      Alert.alert('Check your details', 'Please enter a valid email and a password of at least 6 characters.');
      return;
    }
    // Defer actual Firebase signUp until after onboarding completes —
    // we have the user's profile info collected from the next screens.
    setDraft({});
    if (!firebaseEnabled()) {
      nav.navigate('ProfileSetup');
      return;
    }
    setBusy(true);
    try {
      // Stash credentials in volatile store via draft hack so signup happens at finish
      (useAuthStore as any).setState({ draft: { ...useAuthStore.getState().draft, _email: email, _password: password } });
      nav.navigate('ProfileSetup');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.wrap}>
        <Text style={[styles.title, { color: theme.text }]}>Create your account</Text>
        <Text style={{ color: theme.textMuted, marginBottom: 24 }}>
          {firebaseEnabled() ? 'One quick step before we set you up.' : 'Demo mode — credentials are stored locally only.'}
        </Text>

        <Field label="Email" value={email} onChange={setEmail} icon="mail-outline" placeholder="you@boonmate.app" />
        <Field label="Password (min. 6 chars)" value={password} onChange={setPassword} icon="lock-closed-outline" secure placeholder="••••••••" />

        <GradientButton title={t('common.continue')} onPress={submit} loading={busy} size="lg" style={{ marginTop: 12 }} />
        <View style={{ height: 12 }} />
        <GradientButton title="I already have an account" variant="ghost" onPress={() => nav.navigate('Login')} />
      </View>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, icon, secure, placeholder }: { label: string; value: string; onChange: (s: string) => void; icon: any; secure?: boolean; placeholder?: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <View style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Ionicons name={icon} size={18} color={theme.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          value={value}
          onChangeText={onChange}
          secureTextEntry={secure}
          autoCapitalize="none"
          keyboardType={icon === 'mail-outline' ? 'email-address' : 'default'}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          style={{ flex: 1, color: theme.text, fontSize: 15, paddingVertical: 12 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 22, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
  input: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, paddingHorizontal: 14 },
});
