import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeContext';
import GradientButton from '@/components/GradientButton';
import { useAuthStore } from '@/store/authStore';
import { firebaseEnabled } from '@/services/firebase';

export default function LoginScreen() {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Please enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (e: any) {
      Alert.alert('Sign-in failed', useAuthStore.getState().authError ?? e?.message ?? 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.wrap}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome back</Text>
        <Text style={{ color: theme.textMuted, marginBottom: 24 }}>
          {firebaseEnabled() ? 'Sign in to keep building your community.' : 'Demo mode — Firebase not configured. Any credentials work.'}
        </Text>

        <Field label="Email" value={email} onChange={setEmail} icon="mail-outline" placeholder="you@boonmate.app" />
        <Field label="Password" value={password} onChange={setPassword} icon="lock-closed-outline" secure placeholder="••••••••" />

        <GradientButton title="Log In" onPress={submit} loading={busy} size="lg" style={{ marginTop: 12 }} />
        <View style={{ height: 12 }} />
        <GradientButton title="Create a new account" variant="ghost" onPress={() => nav.navigate('SignUp')} />
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
