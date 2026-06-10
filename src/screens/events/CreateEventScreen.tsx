import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import GradientButton from '@/components/GradientButton';
import Chip from '@/components/Chip';
import { useSocialStore } from '@/store/socialStore';
import type { EventCategory } from '@/utils/types';

const CATEGORIES: { v: EventCategory; emoji: string }[] = [
  { v: 'Hangout', emoji: '☕' }, { v: 'Workshop', emoji: '🛠️' }, { v: 'Meetup', emoji: '👋' },
  { v: 'Outdoor', emoji: '🌲' }, { v: 'Sports', emoji: '⚽' }, { v: 'Support Group', emoji: '💙' },
  { v: 'Networking', emoji: '🌐' }, { v: 'Wellness', emoji: '🧘' }, { v: 'Gaming', emoji: '🎮' },
  { v: 'Other', emoji: '✨' },
];

export default function CreateEventScreen() {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const addEvent = useSocialStore((s) => s.addEvent);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState<EventCategory>('Hangout');

  const create = () => {
    if (!title.trim() || !location.trim()) return;
    const emoji = CATEGORIES.find((c) => c.v === cat)?.emoji ?? '✨';
    addEvent({ title, location, date: date || 'TBD', time: time || 'TBD', category: cat, emoji, description: desc });
    nav.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.header, { borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="close" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontWeight: '800', fontSize: 17 }}>Create Event</Text>
        <GradientButton title="Create" size="sm" onPress={create} disabled={!title.trim() || !location.trim()} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 18 }}>
        <Field label="Title" value={title} onChange={setTitle} placeholder="Sunday Coffee Walk" />
        <Field label="Location" value={location} onChange={setLocation} placeholder="Central Perk Café" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Field label="Date" value={date} onChange={setDate} placeholder="May 23" /></View>
          <View style={{ flex: 1 }}><Field label="Time" value={time} onChange={setTime} placeholder="10:00 AM" /></View>
        </View>
        <Field label="Description" value={desc} onChange={setDesc} placeholder="What should people expect?" multiline />

        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 16, marginBottom: 8 }}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map((c) => (
            <Chip key={c.v} label={`${c.emoji} ${c.v}`} selected={cat === c.v} onPress={() => setCat(c.v)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, placeholder, multiline }: any) {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        multiline={multiline}
        style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border, height: multiline ? 90 : 44, textAlignVertical: multiline ? 'top' : 'center' }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
});
