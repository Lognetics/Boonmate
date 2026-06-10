import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useSocialStore } from '@/store/socialStore';
import GradientButton from '@/components/GradientButton';
import PostCard from '@/components/PostCard';
import ConsentModal from '@/components/ConsentModal';
import Card from '@/components/Card';

export default function CircleDetailScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const id: string = route.params.id;
  const circle = useSocialStore((s) => s.circles.find((c) => c.id === id));
  const posts = useSocialStore((s) => s.posts.filter((p) => p.circleId === id));
  const setJoined = useSocialStore((s) => s.setCircleJoined);
  const [showConsent, setShowConsent] = useState(false);

  if (!circle) return null;

  const onJoinPress = () => {
    if (circle.joined) setJoined(circle.id, false);
    else setShowConsent(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.primaryGradient} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 56 }}>{circle.emoji}</Text>
        <Text style={styles.title}>{circle.name}</Text>
        <Text style={styles.members}>{circle.members} {t('connect.members')}</Text>
      </LinearGradient>

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Card>
              <Text style={{ color: theme.text, fontWeight: '800', fontSize: 15 }}>About this circle</Text>
              <Text style={{ color: theme.textMuted, marginTop: 6 }}>{circle.description}</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <GradientButton
                  title={circle.joined ? `✓ ${t('common.connected')}` : t('common.join')}
                  variant={circle.joined ? 'outline' : 'gradient'}
                  onPress={onJoinPress}
                  style={{ flex: 1 }}
                />
                <GradientButton
                  title="New Post"
                  variant="soft"
                  onPress={() => nav.navigate('CreatePost', { circleId: id })}
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16, marginTop: 16 }}>Posts</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Ionicons name="leaf-outline" size={36} color={theme.textMuted} />
            <Text style={{ color: theme.textMuted, marginTop: 8 }}>Be the first to post here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <PostCard post={item} hideCircle />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <ConsentModal
        visible={showConsent}
        circle={circle}
        onAccept={() => {
          setJoined(circle.id, true);
          setShowConsent(false);
        }}
        onDecline={() => setShowConsent(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 50, paddingBottom: 24, alignItems: 'center' },
  back: { position: 'absolute', top: 14, left: 12, padding: 6 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 6 },
  members: { color: 'rgba(255,255,255,0.85)', marginTop: 2 },
});
