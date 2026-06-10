import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';

interface Props {
  title: string;
  caption?: string;
  back?: boolean;
  right?: React.ReactNode;
  large?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ScreenHeader: React.FC<Props> = ({ title, caption, back, right, large, style }) => {
  const { theme } = useTheme();
  const nav = useNavigation();
  return (
    <View style={[styles.row, style]}>
      {back ? (
        <TouchableOpacity onPress={() => (nav as any).goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.text, fontSize: large ? 24 : 19, fontWeight: '800', letterSpacing: -0.3 }}>{title}</Text>
        {caption ? <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>{caption}</Text> : null}
      </View>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: 8, paddingBottom: 8 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 4, marginLeft: -8 },
});

export default ScreenHeader;
