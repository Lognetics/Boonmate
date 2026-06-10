import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { boonReply } from '@/services/boonAI';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import GradientButton from '@/components/GradientButton';

interface Bubble { id: string; from: 'me' | 'ai'; text: string; followups?: string[] }

const TOPICS = [
  { key: 'topic_friends', emoji: '🤝' },
  { key: 'topic_loneliness', emoji: '💜' },
  { key: 'topic_confidence', emoji: '⭐' },
  { key: 'topic_relationships', emoji: '💞' },
  { key: 'topic_wellness', emoji: '🧘' },
  { key: 'topic_growth', emoji: '🚀' },
  { key: 'topic_coparent', emoji: '👨‍👩‍👧' },
  { key: 'topic_conversation', emoji: '💭' },
];

export default function BoonAIChatScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const { isFeatureAllowed } = useSubscriptionStore();
  const [thread, setThread] = useState<Bubble[]>([{ id: 'intro', from: 'ai', text: t('chat.ai_intro') }]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceOut, setVoiceOut] = useState(false);
  const listRef = useRef<FlatList<any>>(null);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userBubble: Bubble = { id: `u_${Date.now()}`, from: 'me', text };
    setThread((th) => [...th, userBubble]);
    setInput('');
    setThinking(true);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    try {
      const r = await boonReply(text);
      const aiBubble: Bubble = { id: `a_${Date.now()}`, from: 'ai', text: r.text, followups: r.followups };
      setThread((th) => [...th, aiBubble]);
      if (voiceOut) Speech.speak(r.text, { rate: 1.0, pitch: 1.0 });
    } finally {
      setThinking(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  };

  const onMic = () => {
    if (!isFeatureAllowed('voice')) {
      Alert.alert('Voice on Plus & Pro', 'Voice chat with Boon AI is part of the Plus and Pro plans.', [
        { text: 'Maybe later' },
        { text: 'Upgrade', onPress: () => nav.navigate('Subscription') },
      ]);
      return;
    }
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      send('I want to talk about loneliness.');
    }, 1400);
  };

  const onVoiceToggle = () => {
    if (!isFeatureAllowed('voice')) {
      Alert.alert('Voice on Plus & Pro', 'Voice playback is part of the Plus and Pro plans.', [
        { text: 'Maybe later' },
        { text: 'Upgrade', onPress: () => nav.navigate('Subscription') },
      ]);
      return;
    }
    setVoiceOut(!voiceOut);
    if (voiceOut) Speech.stop();
  };

  const hasUserSent = thread.some((b) => b.from === 'me');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={[styles.header, { borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <LinearGradient colors={theme.primaryGradient} style={styles.av}>
          <Ionicons name="sparkles" size={18} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14, letterSpacing: -0.2 }}>Boon AI</Text>
          <Text style={{ color: theme.success, fontSize: 10 }}>● {t('boon.always_available')}</Text>
        </View>
        <TouchableOpacity onPress={onVoiceToggle} style={styles.iconBtn}>
          <Ionicons name={voiceOut ? 'volume-high' : 'volume-mute'} size={20} color={voiceOut ? theme.primary : theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setThread([{ id: 'intro', from: 'ai', text: t('chat.ai_intro') }])} style={styles.iconBtn}>
          <Ionicons name="refresh" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={thread}
          keyExtractor={(b) => b.id}
          contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 12 }}
          renderItem={({ item }) => (
            <View style={{ alignItems: item.from === 'me' ? 'flex-end' : 'flex-start' }}>
              {item.from === 'me' ? (
                <LinearGradient colors={theme.primaryGradient} style={[styles.bubble, styles.bubbleMine]}>
                  <Text style={{ color: '#fff', fontSize: 14 }}>{item.text}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.bubble, styles.bubbleAI, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={{ color: theme.text, fontSize: 14, lineHeight: 20 }}>{item.text}</Text>
                </View>
              )}
              {item.followups && item.followups.length > 0 ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {item.followups.map((f: string) => (
                    <TouchableOpacity key={f} onPress={() => send(f)} style={[styles.followup, { borderColor: theme.primary }]}>
                      <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '700' }}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>
          )}
          ListFooterComponent={
            <View>
              {thinking ? (
                <View style={[styles.bubble, styles.bubbleAI, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={{ color: theme.textMuted }}>● ● ●</Text>
                </View>
              ) : null}
              {!hasUserSent ? (
                <View style={{ marginTop: 18 }}>
                  <Text style={{ color: theme.textMuted, fontWeight: '700', marginBottom: 8 }}>{t('chat.suggested_topics')}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {TOPICS.map((tp) => (
                      <TouchableOpacity
                        key={tp.key}
                        onPress={() => send(t(`chat.${tp.key}`))}
                        style={[styles.topic, { backgroundColor: theme.card, borderColor: theme.border }]}
                      >
                        <Text style={{ marginRight: 6 }}>{tp.emoji}</Text>
                        <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>{t(`chat.${tp.key}`)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          }
        />

        <View style={[styles.inputRow, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TouchableOpacity onPress={onMic} style={[styles.mic, { backgroundColor: recording ? theme.primary : 'transparent', borderColor: theme.border }]}>
            <Ionicons name={recording ? 'mic' : 'mic-outline'} size={18} color={recording ? '#fff' : theme.text} />
          </TouchableOpacity>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Boon AI anything…"
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, marginHorizontal: 8, paddingVertical: 10 }}
            multiline
          />
          <TouchableOpacity onPress={() => send(input)}>
            <LinearGradient colors={theme.primaryGradient} style={styles.sendBtn}>
              <Ionicons name="send" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={{ color: theme.textMuted, fontSize: 11, textAlign: 'center', paddingVertical: 6 }}>{t('chat.ai_disclaimer')}</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1 },
  av: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: '85%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, marginVertical: 6 },
  bubbleMine: { borderBottomRightRadius: 4 },
  bubbleAI: { borderWidth: 1, borderBottomLeftRadius: 4 },
  followup: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  topic: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, borderWidth: 1, minWidth: '47%' },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, borderTopWidth: 1 },
  mic: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  sendBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
