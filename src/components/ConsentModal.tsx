import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import GradientButton from './GradientButton';
import type { Circle } from '@/utils/types';

interface Props {
  visible: boolean;
  circle: Circle | null;
  onAccept: () => void;
  onDecline: () => void;
}

const DEFAULT_RULES = [
  'Be respectful and kind to all members',
  'No hate speech, harassment, or discrimination',
  'Keep discussions relevant to the community',
  "Respect others' privacy and boundaries",
  'Report harmful content to moderators',
];

const ConsentModal: React.FC<Props> = ({ visible, circle, onAccept, onDecline }) => {
  const { theme } = useTheme();
  const { t } = useT();
  const [agreed, setAgreed] = useState(false);

  if (!circle) return null;
  const rules = circle.rules ?? DEFAULT_RULES;
  const isSurrogacy = circle.consentTone === 'surrogacy';
  const heading = isSurrogacy ? `${circle.emoji ?? '⚠️'} ${circle.name} — Important Notice` : `${circle.emoji ?? '💜'} ${circle.name}`;
  const intro = isSurrogacy
    ? 'This circle is for informational sharing and emotional support around the surrogacy journey.'
    : t('consent.default_intro');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDecline}>
      <View style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity onPress={onDecline} style={styles.close}>
            <Ionicons name="close" size={22} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.headerRow}>
            <LinearGradient colors={theme.primaryGradient} style={styles.shield}>
              <Ionicons name="shield-checkmark" size={18} color="#fff" />
            </LinearGradient>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 18, flex: 1 }}>
              {isSurrogacy ? 'Surrogacy Support — Important Notice' : t('consent.title')}
            </Text>
          </View>

          <Text style={{ color: theme.textMuted, marginTop: 6 }}>{intro}</Text>

          <Text style={[styles.section, { color: theme.textMuted }]}>{t('consent.rules')}</Text>

          <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator={false}>
            {rules.map((rule, i) => (
              <View key={i} style={[styles.rule, { borderColor: theme.border }]}>
                <LinearGradient colors={theme.primaryGradient} style={styles.num}>
                  <Text style={{ color: '#fff', fontWeight: '800' }}>{i + 1}</Text>
                </LinearGradient>
                <Text style={{ color: theme.text, flex: 1 }}>{rule}</Text>
              </View>
            ))}

            {circle.notice ? (
              <View
                style={[
                  styles.notice,
                  { borderColor: isSurrogacy ? theme.warning : theme.border, backgroundColor: isSurrogacy ? '#4A2A1E22' : theme.surface },
                ]}
              >
                <Text style={{ color: isSurrogacy ? theme.warning : theme.textMuted, fontWeight: '600', lineHeight: 19 }}>
                  {isSurrogacy ? '⚠️ ⚠️ ' : ''}
                  {circle.notice}
                </Text>
              </View>
            ) : null}
          </ScrollView>

          <Pressable onPress={() => setAgreed(!agreed)} style={[styles.agreeBox, { borderColor: theme.border }]}>
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: agreed ? theme.primary : theme.border,
                  backgroundColor: agreed ? theme.primary : 'transparent',
                },
              ]}
            >
              {agreed ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
            </View>
            <Text style={{ color: theme.text, flex: 1, fontSize: 13 }}>{t('consent.agree')}</Text>
          </Pressable>

          <View style={styles.actions}>
            <GradientButton title={t('common.decline')} variant="outline" onPress={onDecline} style={{ flex: 1 }} />
            <GradientButton title={t('common.accept')} onPress={onAccept} disabled={!agreed} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18 },
  card: { width: '100%', maxWidth: 460, borderRadius: 22, padding: 18, borderWidth: 1 },
  close: { position: 'absolute', top: 12, right: 12, zIndex: 5, padding: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 28 },
  shield: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  section: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginTop: 16, marginBottom: 8 },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 8 },
  num: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  notice: { borderWidth: 1, borderRadius: 14, padding: 12, marginVertical: 8 },
  agreeBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
});

export default ConsentModal;
