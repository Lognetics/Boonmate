import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import GradientButton from '@/components/GradientButton';
import type { Plan } from '@/utils/types';

const TIERS: { id: Plan; emoji: string; price: string; subtitle: string; features: string[] }[] = [
  { id: 'free', emoji: '🆓', price: '', subtitle: 'Free forever', features: ['Join circles', 'Basic messaging', '5 events/month', '10 AI messages/day'] },
  { id: 'basic', emoji: '⭐', price: '$3/month', subtitle: '', features: ['30 AI messages/day', '15 connections/day', 'More events access', 'Priority suggestions'] },
  { id: 'plus', emoji: '💜', price: '$5/month', subtitle: '', features: ['Unlimited messaging', 'Priority discovery', 'Premium circles', 'Voice AI unlocked'] },
  { id: 'pro', emoji: '🚀', price: '$10/month', subtitle: '', features: ['All features', 'Advanced AI insights', 'Anonymous mode', 'Exclusive communities', 'Priority support', 'Early access'] },
];

export default function SubscriptionScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const { plan, setPlan } = useSubscriptionStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={[styles.header, { borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 22, marginRight: 8 }}>👑</Text>
          <View>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 18 }}>{t('subscription.title')}</Text>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>{t('subscription.sub')}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="close" size={26} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80, gap: 14 }}>
        {TIERS.map((tier) => {
          const isCurrent = tier.id === plan;
          const isPro = tier.id === 'pro';
          return (
            <View
              key={tier.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme.card,
                  borderColor: isCurrent ? theme.primary : theme.border,
                  borderWidth: isCurrent ? 2 : 1,
                },
              ]}
            >
              <View style={styles.tierHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 20 }}>{tier.emoji}</Text>
                    <Text style={{ color: theme.text, fontWeight: '900', fontSize: 18 }}>{t(`subscription.${tier.id}`)}</Text>
                  </View>
                  {tier.subtitle ? (
                    <Text style={{ color: theme.textMuted, marginTop: 4, fontSize: 13 }}>{tier.subtitle}</Text>
                  ) : (
                    <Text style={{ color: isPro ? theme.primary : theme.text, fontWeight: '700', marginTop: 4 }}>{tier.price}</Text>
                  )}
                </View>
                {isCurrent ? (
                  <LinearGradient colors={theme.primaryGradient} style={styles.currentTag}>
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{t('subscription.current')}</Text>
                  </LinearGradient>
                ) : tier.id === 'free' ? (
                  <TouchableOpacity onPress={() => setPlan('free')} style={[styles.outlineBtn, { borderColor: theme.border }]}>
                    <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12 }}>{t('subscription.downgrade')}</Text>
                  </TouchableOpacity>
                ) : (
                  <GradientButton
                    title={`⚡ ${t('subscription.select')}`}
                    size="sm"
                    onPress={() => setPlan(tier.id)}
                  />
                )}
              </View>

              <View style={{ marginTop: 12, gap: 6 }}>
                {tier.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Ionicons name="checkmark" size={14} color={theme.success} />
                    <Text style={{ color: theme.text, marginLeft: 6, fontSize: 13 }}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: 'center', marginTop: 8 }}>
          {t('subscription.demo_notice')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  card: { borderRadius: 18, padding: 16 },
  tierHeader: { flexDirection: 'row', alignItems: 'center' },
  currentTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  outlineBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
});
