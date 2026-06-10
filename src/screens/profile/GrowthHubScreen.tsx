import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeContext';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import { growthHubItems } from '@/services/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function GrowthHubScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScreenHeader title="Growth Hub" caption="Wellness, growth, and connection essentials" back />
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80, gap: 12 }}>
        <Card>
          <View style={styles.row}>
            <LinearGradient colors={theme.primaryGradient} style={styles.icon}>
              <Ionicons name="trophy" size={18} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: theme.text, fontWeight: '800' }}>This week's challenge</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>Send one message a day to someone you've been thinking about.</Text>
            </View>
          </View>
        </Card>
        {growthHubItems.map((g) => (
          <Card key={g.id}>
            <View style={styles.row}>
              <Text style={{ fontSize: 26, marginRight: 8 }}>{g.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: '800' }}>{g.title}</Text>
                <Text style={{ color: theme.textMuted, marginTop: 4, lineHeight: 19 }}>{g.body}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
