import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useSocialStore } from '@/store/socialStore';
import { ME_ID } from '@/services/mockData';
import Avatar from '@/components/Avatar';
import { shortTime } from '@/utils/time';

const QUICK = ['That sounds amazing! 🎉', "I'd love to join!", "Let's connect soon"];

export default function ChatRoomScreen() {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const id: string = route.params.id;
  const chat = useSocialStore((s) => s.chats.find((c) => c.id === id));
  const user = useSocialStore((s) => s.users.find((u) => u.id === chat?.withUserId));
  const sendMessage = useSocialStore((s) => s.sendMessage);
  const markRead = useSocialStore((s) => s.markChatRead);
  const attachChatMessages = useSocialStore((s) => s.attachChatMessages);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    if (chat?.unread) markRead(chat.id);
    if (!chat) return;
    const off = attachChatMessages(chat.id);
    return () => off();
  }, [chat?.id]);

  if (!chat || !user) return null;

  const send = (t?: string) => {
    const val = (t ?? text).trim();
    if (!val) return;
    sendMessage(chat.id, val);
    setText('');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={[styles.header, { borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => nav.goBack()} style={{ marginRight: 6 }}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate('UserProfile', { id: user.id })} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Avatar uri={user.avatar} name={user.name} size={36} online={user.online} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14, letterSpacing: -0.2 }}>{user.name}</Text>
            <Text style={{ color: theme.success, fontSize: 10 }}>{user.online ? 'Active now' : 'Last seen recently'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}><Ionicons name="call-outline" size={20} color={theme.text} /></TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}><Ionicons name="videocam-outline" size={22} color={theme.text} /></TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={chat.messages}
          keyExtractor={(m) => m.id}
          ListHeaderComponent={
            <View style={{ alignItems: 'center', padding: 18 }}>
              <Avatar uri={user.avatar} name={user.name} size={68} />
              <Text style={{ color: theme.text, fontWeight: '800', marginTop: 10 }}>{user.name}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: 'center', maxWidth: 280, marginTop: 4 }} numberOfLines={2}>{user.bio}</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {user.interests.slice(0, 3).map((tag) => (
                  <View key={tag} style={[styles.tag, { backgroundColor: theme.primarySoft }]}>
                    <Text style={{ color: theme.primary, fontSize: 11, fontWeight: '700' }}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const mine = item.fromId === ME_ID;
            return (
              <View style={[styles.bubbleRow, { justifyContent: mine ? 'flex-end' : 'flex-start' }]}>
                {!mine ? <Avatar uri={user.avatar} name={user.name} size={28} style={{ marginRight: 6 }} /> : null}
                {mine ? (
                  <LinearGradient colors={theme.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.bubble, styles.bubbleMine]}>
                    <Text style={{ color: '#fff', fontSize: 14 }}>{item.text}</Text>
                    <Text style={styles.bubbleTimeMine}>{shortTime(item.at)}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.bubble, styles.bubbleTheirs, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={{ color: theme.text, fontSize: 14 }}>{item.text}</Text>
                    <Text style={[styles.bubbleTime, { color: theme.textMuted }]}>{shortTime(item.at)}</Text>
                  </View>
                )}
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 14 }}
        />

        <View style={styles.quickRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 8, alignItems: 'center' }}
          >
            {QUICK.map((q) => (
              <TouchableOpacity key={q} onPress={() => send(q)} style={[styles.quick, { backgroundColor: theme.primarySoft }]}>
                <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '700' }}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.inputRow, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message…"
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, paddingHorizontal: 8, paddingVertical: 10 }}
            multiline
          />
          <TouchableOpacity onPress={() => send()}>
            <LinearGradient colors={theme.primaryGradient} style={styles.sendBtn}>
              <Ionicons name="send" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, marginVertical: 4 },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMine: { borderBottomRightRadius: 4 },
  bubbleTheirs: { borderWidth: 1, borderBottomLeftRadius: 4 },
  bubbleTime: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  bubbleTimeMine: { fontSize: 10, marginTop: 4, textAlign: 'right', color: 'rgba(255,255,255,0.8)' },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  quickRow: { height: 40, marginBottom: 6 },
  quick: { paddingHorizontal: 14, height: 30, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1 },
  sendBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
});
