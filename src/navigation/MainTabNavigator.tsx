import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { MainTabParams } from './types';
import HomeScreen from '@/screens/home/HomeScreen';
import ConnectScreen from '@/screens/connect/ConnectScreen';
import EventsScreen from '@/screens/events/EventsScreen';
import ChatListScreen from '@/screens/chat/ChatListScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParams>();

type IconName = keyof typeof Ionicons.glyphMap;

const ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Connect: { active: 'people', inactive: 'people-outline' },
  Events: { active: 'calendar', inactive: 'calendar-outline' },
  Chat: { active: 'chatbubble', inactive: 'chatbubble-outline' },
  Me: { active: 'person', inactive: 'person-outline' },
};

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const { t } = useT();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          paddingTop: 6,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? ICONS[route.name].active : ICONS[route.name].inactive} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabs.home') }} />
      <Tab.Screen name="Connect" component={ConnectScreen} options={{ title: t('tabs.connect') }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ title: t('tabs.events') }} />
      <Tab.Screen name="Chat" component={ChatListScreen} options={{ title: t('tabs.chat') }} />
      <Tab.Screen name="Me" component={ProfileScreen} options={{ title: t('tabs.me') }} />
    </Tab.Navigator>
  );
}
