import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeContext';
import { useSocialStore } from '@/store/socialStore';
import ScreenHeader from '@/components/ScreenHeader';
import { timeAgo } from '@/utils/time';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const items = useSocialStore((s) => s.notifications);
  const markAll = useSocialStore((s) => s.markAllNotificationsRead);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScreenHeader title="Notifications" back right={<Text onPress={markAll} style={{ color: theme.primary, fontWeight: '700' }}>Mark all read</Text>} />
      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
              <Ionicons name="notifications" size={16} color={theme.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: theme.text, fontWeight: '700' }}>{item.title}</Text>
              <Text style={{ color: theme.textMuted, marginTop: 2 }}>{item.body}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }}>{timeAgo(item.at)}</Text>
            </View>
            {!item.read ? <View style={[styles.unread, { backgroundColor: theme.primary }]} /> : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  icon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  unread: { width: 8, height: 8, borderRadius: 4, marginLeft: 6 },
});
