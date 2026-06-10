import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';
import GradientButton from '@/components/GradientButton';
import Chip from '@/components/Chip';
import Avatar from '@/components/Avatar';
import type { Status } from '@/utils/types';
import { firebaseEnabled, uploadImageToStorage } from '@/services/firebase';

const STATUSES: Status[] = ['Available', 'Busy', 'Away', 'Working'];

const INTEREST_OPTIONS = [
  'Reading', 'Photography', 'Writing', 'Fashion', 'Yoga', 'Meditation', 'Fitness', 'Cooking',
  'Technology', 'Music', 'Hiking', 'Art', 'Design', 'Travel', 'Business', 'Gaming',
];

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? '');
  const [location, setLocation] = useState(user.location ?? '');
  const [status, setStatus] = useState<Status>(user.status);
  const [interests, setInterests] = useState<string[]>(user.interests);
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true });
    if (!r.canceled && r.assets[0]) setAvatar(r.assets[0].uri);
  };

  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      let avatarUrl = avatar;
      if (firebaseEnabled() && avatar && avatar.startsWith('file:') && user.id !== 'me') {
        avatarUrl = await uploadImageToStorage(avatar, `avatars/${user.id}/avatar.jpg`);
      }
      await updateProfile({ name, bio, location, status, interests, avatar: avatarUrl });
      nav.goBack();
    } finally {
      setSaving(false);
    }
  };

  const toggle = (i: string) => setInterests(interests.includes(i) ? interests.filter((x) => x !== i) : [...interests, i]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={[styles.header, { borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="close" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontWeight: '800', fontSize: 17 }}>{t('profile.edit')}</Text>
        <GradientButton title={t('common.save')} size="sm" onPress={save} loading={saving} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80 }}>
        <View style={{ alignItems: 'center', marginBottom: 18 }}>
          <TouchableOpacity onPress={pickAvatar}>
            <Avatar uri={avatar} name={name} size={104} ring />
            <View style={[styles.edit, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="camera" size={14} color={theme.primary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickAvatar}><Text style={{ color: theme.primary, marginTop: 10, fontWeight: '700' }}>Change photo</Text></TouchableOpacity>
        </View>

        <Field label="Display name" value={name} onChange={setName} />
        <Field label="Bio" value={bio} onChange={setBio} multiline />
        <Field label="Location" value={location} onChange={setLocation} />

        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 8, marginBottom: 6 }}>Status</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {STATUSES.map((s) => (
            <Chip key={s} label={s} selected={status === s} onPress={() => setStatus(s)} />
          ))}
        </View>

        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 16, marginBottom: 6 }}>Interests</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {INTEREST_OPTIONS.map((i) => (
            <Chip key={i} label={i} selected={interests.includes(i)} onPress={() => toggle(i)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (s: string) => void; multiline?: boolean }) {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border, height: multiline ? 80 : 44, textAlignVertical: multiline ? 'top' : 'center' }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  edit: { position: 'absolute', right: -2, bottom: -2, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
});
