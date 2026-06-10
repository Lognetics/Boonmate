import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeContext';
import { useSocialStore } from '@/store/socialStore';
import { timeAgo } from '@/utils/time';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const KIND_ICON: Record<string, any> = {
  connect: 'person-add',
  event: 'calendar',
  circle: 'people',
  message: 'chatbubble',
  ai: 'sparkles',
};

const NotificationsPopover: React.FC<Props> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const items = useSocialStore((s) => s.notifications);
  const markAll = useSocialStore((s) => s.markAllNotificationsRead);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: theme.overlay }]} onPress={onClose}>
        <Pressable style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.headerRow}>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16 }}>Notifications</Text>
            <TouchableOpacity onPress={markAll}>
              <Text style={{ color: theme.primary, fontWeight: '700' }}>Mark all read</Text>
            </TouchableOpacity>
          </View>
          {items.length === 0 ? (
            <Text style={{ color: theme.textMuted, padding: 20, textAlign: 'center' }}>You're all caught up.</Text>
          ) : (
            items.map((n) => (
              <View key={n.id} style={[styles.item, { borderColor: theme.border }]}>
                <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
                  <Ionicons name={KIND_ICON[n.kind]} size={16} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontWeight: '700' }}>{n.title}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12 }} numberOfLines={1}>{n.body}</Text>
                </View>
                <Text style={{ color: theme.textMuted, fontSize: 11 }}>{timeAgo(n.at)}</Text>
                {!n.read ? <View style={[styles.unread, { backgroundColor: theme.primary }]} /> : null}
              </View>
            ))
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, paddingTop: 80, paddingHorizontal: 12 },
  card: { borderRadius: 18, padding: 12, borderWidth: 1, maxWidth: 380, alignSelf: 'flex-end', width: '94%' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 6, marginBottom: 6 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 6, borderTopWidth: 1 },
  icon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  unread: { width: 8, height: 8, borderRadius: 4, marginLeft: 6 },
});

export default NotificationsPopover;
