import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useSocialStore } from '@/store/socialStore';
import Avatar from '@/components/Avatar';
import BadgePill from '@/components/BadgePill';
import GradientButton from '@/components/GradientButton';
import Card from '@/components/Card';
import PostCard from '@/components/PostCard';

export default function UserProfileScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const id: string = route.params.id;
  const user = useSocialStore((s) => s.users.find((u) => u.id === id));
  const posts = useSocialStore((s) => s.posts.filter((p) => p.authorId === id));
  const toggleConnect = useSocialStore((s) => s.toggleConnect);
  const startChat = useSocialStore((s) => s.startChat);

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <LinearGradient colors={theme.primaryGradient} style={styles.cover} />
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={{ paddingHorizontal: 18, marginTop: -50 }}>
          <Avatar uri={user.avatar} name={user.name} size={96} ring online={user.online} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', flex: 1 }}>{user.name}</Text>
            <View style={[styles.statusPill, { backgroundColor: theme.primarySoft }]}>
              <View style={[styles.dot, { backgroundColor: theme.success }]} />
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: '700' }}>{user.status}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="location-outline" size={14} color={theme.textMuted} />
            <Text style={{ color: theme.textMuted, marginLeft: 4 }}>{user.location}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            {user.badges?.map((b) => <BadgePill key={b} kind={b} />)}
          </View>

          <Text style={{ color: theme.text, marginTop: 14, lineHeight: 21 }}>{user.bio}</Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <GradientButton
              title={user.connected ? `✓ ${t('common.connected')}` : t('common.connect')}
              variant={user.connected ? 'outline' : 'gradient'}
              onPress={() => toggleConnect(user.id)}
              style={{ flex: 1 }}
            />
            <GradientButton
              title={t('common.message')}
              variant="soft"
              icon={<Ionicons name="chatbubble" size={14} color={theme.primary} />}
              onPress={async () => {
                const cid = await startChat(user.id);
                nav.navigate('ChatRoom', { id: cid });
              }}
              style={{ flex: 1 }}
            />
          </View>

          <Card style={{ marginTop: 18 }}>
            <Text style={{ color: theme.text, fontWeight: '800', marginBottom: 8 }}>Interests</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {user.interests.map((i) => (
                <View key={i} style={[styles.tag, { backgroundColor: theme.chipBg }]}>
                  <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600' }}>{i}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card style={{ marginTop: 12 }}>
            <Text style={{ color: theme.text, fontWeight: '800', marginBottom: 4 }}>Shared Circles</Text>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>You and {user.name.split(' ')[0]} have {user.mutualConnections} mutual connections.</Text>
          </Card>

          {posts.length > 0 ? (
            <>
              <Text style={{ color: theme.text, fontWeight: '800', marginTop: 18, marginBottom: 8 }}>Recent posts</Text>
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cover: { height: 140 },
  back: { position: 'absolute', top: 14, left: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
});
