import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useSocialStore } from '@/store/socialStore';
import Avatar from '@/components/Avatar';
import Card from '@/components/Card';
import { shortTime, timeAgo } from '@/utils/time';

export default function ChatListScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const chats = useSocialStore((s) => s.chats);
  const users = useSocialStore((s) => s.users);
  const recent = chats.filter((c) => c.messages.length > 1);
  const yours = chats.filter((c) => c.messages.length <= 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.3 }}>{t('chat.title')}</Text>
          <Text style={{ color: theme.textMuted, marginTop: 2, fontSize: 12 }}>{t('chat.sub')}</Text>
        </View>
        <TouchableOpacity onPress={() => nav.navigate('BoonAIChat')}>
          <LinearGradient colors={theme.primaryGradient} style={styles.aiBtn}>
            <Ionicons name="sparkles" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 18, marginTop: 12 }}>
        <View style={[styles.search, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search" size={16} color={theme.textMuted} />
          <TextInput placeholder="Search messages…" placeholderTextColor={theme.textMuted} style={{ flex: 1, marginLeft: 8, color: theme.text }} />
        </View>
      </View>

      <FlatList
        data={recent}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 18, paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            <TouchableOpacity onPress={() => nav.navigate('BoonAIChat')} activeOpacity={0.9}>
              <Card style={[styles.aiCard, { borderColor: theme.primary }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LinearGradient colors={theme.primaryGradient} style={styles.aiAv}>
                    <Ionicons name="sparkles" size={20} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14, letterSpacing: -0.2 }}>Boon AI</Text>
                      <View style={[styles.smartTag, { backgroundColor: theme.primarySoft }]}>
                        <Text style={{ color: theme.primary, fontSize: 10, fontWeight: '700' }}>Smart</Text>
                      </View>
                    </View>
                    <Text numberOfLines={1} style={{ color: theme.textMuted, marginTop: 2, fontSize: 12 }}>{t('chat.ai_pin')}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
            <Text style={{ color: theme.textMuted, fontWeight: '700', marginTop: 16, marginBottom: 6 }}>{t('chat.recent')}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const user = users.find((u) => u.id === item.withUserId);
          if (!user) return null;
          return (
            <TouchableOpacity onPress={() => nav.navigate('ChatRoom', { id: item.id })} activeOpacity={0.85} style={[styles.row, { borderColor: theme.border }]}>
              <Avatar uri={user.avatar} name={user.name} size={48} online={user.online} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.rowTop}>
                  <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}>{user.name}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 10 }}>
                    {sinceShort(item.at)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Text style={{ color: theme.textMuted, flex: 1, fontSize: 12 }} numberOfLines={1}>{item.preview}</Text>
                  {item.unread ? (
                    <View style={[styles.unread, { backgroundColor: theme.primary }]}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{item.unread}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          yours.length > 0 ? (
            <View>
              <Text style={{ color: theme.textMuted, fontWeight: '700', marginTop: 16, marginBottom: 6 }}>{t('chat.your_chats')}</Text>
              {yours.map((c) => {
                const user = users.find((u) => u.id === c.withUserId);
                if (!user) return null;
                return (
                  <TouchableOpacity key={c.id} onPress={() => nav.navigate('ChatRoom', { id: c.id })} style={[styles.row, { borderColor: theme.border }]}>
                    <Avatar name={user.name} size={40} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ color: theme.text, fontWeight: '700' }}>{user.name}</Text>
                      <Text style={{ color: theme.textMuted, fontSize: 12 }}>{c.preview || 'Say hi 👋'}</Text>
                    </View>
                    <Text style={{ color: theme.textMuted, fontSize: 11 }}>{timeAgo(c.at)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

function sinceShort(iso: string) {
  const d = new Date(iso);
  const days = (Date.now() - d.getTime()) / 86400000;
  if (days < 1) return shortTime(iso);
  if (days < 2) return 'Yesterday';
  if (days < 7) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { month: 'short', day: '2-digit' });
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: 8 },
  aiBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, height: 44 },
  aiCard: { borderWidth: 1 },
  aiAv: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  smartTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  unread: { minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, marginLeft: 6 },
});
