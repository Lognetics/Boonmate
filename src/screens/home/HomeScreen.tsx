import React, { useMemo, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';
import { useSocialStore } from '@/store/socialStore';
import Avatar from '@/components/Avatar';
import Card from '@/components/Card';
import Chip from '@/components/Chip';
import PostCard from '@/components/PostCard';
import NotificationsPopover from '@/components/NotificationsPopover';
import LiveStripe from '@/components/LiveStripe';
import { dailyInsight } from '@/services/boonAI';

type FeedTab = 'All' | 'Circles' | 'People';

export default function HomeScreen() {
  const { theme, isDark, toggle } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const posts = useSocialStore((s) => s.posts);
  const users = useSocialStore((s) => s.users);
  const notifs = useSocialStore((s) => s.notifications);
  const [tab, setTab] = useState<FeedTab>('All');
  const [topic, setTopic] = useState<'Home' | 'Discovery'>('Home');
  const [insight, setInsight] = useState(dailyInsight());
  const [notifOpen, setNotifOpen] = useState(false);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return t('home.good_morning');
    if (h < 18) return t('home.good_afternoon');
    return t('home.good_evening');
  }, [t]);

  const filtered = useMemo(() => {
    if (tab === 'Circles') return posts.filter((p) => p.circleId);
    if (tab === 'People') return posts.filter((p) => !p.circleId);
    return posts;
  }, [posts, tab]);

  const suggested = users.filter((u) => !u.connected);
  const circles = useSocialStore((s) => s.circles);
  const suggestedCircles = circles.filter((c) => !c.joined).slice(0, 10);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => nav.navigate('MainTabs', { screen: 'Me' })}>
            <Avatar size={36} name={user.name} uri={user.avatar} />
          </TouchableOpacity>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: theme.textMuted, fontSize: 11 }}>{greeting},</Text>
            <Text style={{ color: theme.primary, fontWeight: '900', fontSize: 14, letterSpacing: -0.2 }}>
              {user.name} <Text>👋</Text>
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => nav.navigate('BoonAIChat')}>
          <LinearGradient colors={theme.primaryGradient} style={styles.gradIcon}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={toggle}>
          <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setNotifOpen(true)}>
          <Ionicons name="notifications-outline" size={22} color={theme.text} />
          {unread > 0 ? (
            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{unread}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingTop: 4 }}>
            <Card style={{ marginBottom: 12 }}>
              <View style={styles.aiRow}>
                <LinearGradient colors={theme.primaryGradient} style={styles.aiIcon}>
                  <Ionicons name="sparkles" size={18} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 13 }}>Boon AI <Text style={{ color: theme.textMuted, fontWeight: '500' }}>Daily Insight</Text></Text>
                  <Text style={{ color: theme.text, marginTop: 6, lineHeight: 19, fontSize: 13 }}>{insight}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 14 }}>
                    <TouchableOpacity onPress={() => setInsight(dailyInsight())} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="sparkles" size={12} color={theme.primary} />
                      <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 12 }}>{t('common.refresh')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => nav.navigate('BoonAIChat')}>
                      <Text style={{ color: theme.textMuted, fontWeight: '600', fontSize: 12 }}>{t('home.chat_with_boon')} →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card>

            <TouchableOpacity onPress={() => nav.navigate('CreatePost')} activeOpacity={0.9}>
              <Card style={{ marginBottom: 14 }}>
                <View style={styles.composerRow}>
                  <Avatar size={36} name={user.name} uri={user.avatar} />
                  <Text style={{ color: theme.textMuted, flex: 1, marginHorizontal: 12 }}>{t('home.share_prompt')}</Text>
                  <LinearGradient colors={theme.primaryGradient} style={styles.plus}>
                    <Ionicons name="add" size={20} color="#fff" />
                  </LinearGradient>
                </View>
              </Card>
            </TouchableOpacity>

            <LiveStripe />

            <View style={styles.suggestedHeader}>
              <Ionicons name="flash" size={13} color={theme.primary} />
              <Text style={{ color: theme.text, fontWeight: '800', marginLeft: 6, fontSize: 14, letterSpacing: -0.2, flex: 1 }}>{t('home.suggested')}</Text>
              <TouchableOpacity onPress={() => nav.navigate('MainTabs', { screen: 'Connect' })}>
                <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 12 }}>See all →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }} contentContainerStyle={{ paddingRight: 10 }}>
              {suggested.map((u) => (
                <TouchableOpacity
                  key={u.id}
                  onPress={() => nav.navigate('UserProfile', { id: u.id })}
                  style={[styles.suggested, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <Avatar uri={u.avatar} name={u.name} size={52} ring />
                  <Text numberOfLines={1} style={{ color: theme.text, fontWeight: '700', marginTop: 8, fontSize: 12 }}>{u.name.split(' ')[0]}</Text>
                  <Text numberOfLines={1} style={{ color: theme.textMuted, fontSize: 10 }}>{u.interests[0]}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Ionicons name="people" size={10} color={theme.primary} />
                    <Text style={{ color: theme.primary, fontSize: 10, marginLeft: 3 }}>{u.mutualConnections} mutual</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => nav.navigate('MainTabs', { screen: 'Connect' })}
                style={[styles.suggested, { backgroundColor: theme.primarySoft, borderColor: theme.primary, alignItems: 'center', justifyContent: 'center' }]}
              >
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="search" size={20} color="#fff" />
                </View>
                <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 12, marginTop: 8 }}>Discover</Text>
                <Text style={{ color: theme.primary, fontSize: 10, marginTop: 2 }}>more people</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.suggestedHeader}>
              <Ionicons name="people-circle" size={14} color={theme.primary} />
              <Text style={{ color: theme.text, fontWeight: '800', marginLeft: 6, fontSize: 14, letterSpacing: -0.2, flex: 1 }}>Circles to join</Text>
              <TouchableOpacity onPress={() => nav.navigate('MainTabs', { screen: 'Connect' })}>
                <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 12 }}>See all →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }} contentContainerStyle={{ paddingRight: 10, gap: 10 }}>
              {suggestedCircles.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => nav.navigate('CircleDetail', { id: c.id })}
                  style={[styles.circleCardSm, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <View style={[styles.circleIconSm, { backgroundColor: theme.primarySoft }]}>
                    <Text style={{ fontSize: 18 }}>{c.emoji ?? '⭕'}</Text>
                  </View>
                  <Text numberOfLines={1} style={{ color: theme.text, fontWeight: '800', fontSize: 12, marginTop: 8 }}>{c.name}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 10, marginTop: 2 }}>{c.members} members</Text>
                  <View style={[styles.joinPill, { backgroundColor: theme.primary }]}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>+ Join</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
              <Chip
                label="🏠 Home"
                selected={topic === 'Home'}
                onPress={() => setTopic('Home')}
              />
              <Chip
                label="✨ Discovery"
                selected={topic === 'Discovery'}
                onPress={() => setTopic('Discovery')}
                tone="muted"
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              <Chip label={`✨ ${t('common.all')}`} selected={tab === 'All'} onPress={() => setTab('All')} />
              <Chip label={`⭕ ${t('home.circles')}`} selected={tab === 'Circles'} onPress={() => setTab('Circles')} />
              <Chip label={`👥 ${t('home.people')}`} selected={tab === 'People'} onPress={() => setTab('People')} />
            </View>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        renderItem={({ item }) => <PostCard post={item} />}
      />

      <NotificationsPopover visible={notifOpen} onClose={() => setNotifOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 6 },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  gradIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  aiRow: { flexDirection: 'row' },
  aiIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  composerRow: { flexDirection: 'row', alignItems: 'center' },
  plus: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  suggestedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  suggested: { width: 110, padding: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1, marginRight: 10 },
  circleCardSm: { width: 140, padding: 12, borderRadius: 16, borderWidth: 1 },
  circleIconSm: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  joinPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginTop: 8 },
});
