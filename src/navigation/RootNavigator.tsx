import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/authStore';
import OnboardingNavigator from './OnboardingNavigator';
import MainTabNavigator from './MainTabNavigator';
import { RootStackParams } from './types';
import PostDetailScreen from '@/screens/home/PostDetailScreen';
import CreatePostScreen from '@/screens/home/CreatePostScreen';
import UserProfileScreen from '@/screens/connect/UserProfileScreen';
import CircleDetailScreen from '@/screens/connect/CircleDetailScreen';
import ChatRoomScreen from '@/screens/chat/ChatRoomScreen';
import BoonAIChatScreen from '@/screens/chat/BoonAIChatScreen';
import CreateEventScreen from '@/screens/events/CreateEventScreen';
import EventDetailScreen from '@/screens/events/EventDetailScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import SettingsScreen from '@/screens/profile/SettingsScreen';
import SubscriptionScreen from '@/screens/profile/SubscriptionScreen';
import GrowthHubScreen from '@/screens/profile/GrowthHubScreen';
import NeurodiversityHubScreen from '@/screens/profile/NeurodiversityHubScreen';
import TherapistsScreen from '@/screens/profile/TherapistsScreen';
import SurrogacyScreen from '@/screens/profile/SurrogacyScreen';
import LanguagePickerScreen from '@/screens/profile/LanguagePickerScreen';
import NotificationsScreen from '@/screens/home/NotificationsScreen';
import GoLiveScreen from '@/screens/live/GoLiveScreen';
import LiveViewerScreen from '@/screens/live/LiveViewerScreen';

const Stack = createNativeStackNavigator<RootStackParams>();

export default function RootNavigator() {
  const status = useAuthStore((s) => s.status);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === 'onboarding' ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} />
          <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="CircleDetail" component={CircleDetailScreen} />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          <Stack.Screen name="BoonAIChat" component={BoonAIChatScreen} />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="GrowthHub" component={GrowthHubScreen} />
          <Stack.Screen name="NeurodiversityHub" component={NeurodiversityHubScreen} />
          <Stack.Screen name="Therapists" component={TherapistsScreen} />
          <Stack.Screen name="Surrogacy" component={SurrogacyScreen} />
          <Stack.Screen name="LanguagePicker" component={LanguagePickerScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="GoLive" component={GoLiveScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="LiveViewer" component={LiveViewerScreen} options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
