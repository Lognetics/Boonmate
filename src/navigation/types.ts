import type { NavigatorScreenParams } from '@react-navigation/native';

export type OnboardingStackParams = {
  Welcome: undefined;
  Language: { fromSettings?: boolean } | undefined;
  Login: undefined;
  SignUp: undefined;
  ProfileSetup: undefined;
  Personality: undefined;
  LifeStage: undefined;
  Interests: undefined;
  Intent: undefined;
  LookingFor: undefined;
  Availability: undefined;
  CircleSuggestions: undefined;
  NotificationsOptIn: undefined;
};

export type MainTabParams = {
  Home: undefined;
  Connect: undefined;
  Events: undefined;
  Chat: undefined;
  Me: undefined;
};

export type RootStackParams = {
  Onboarding: NavigatorScreenParams<OnboardingStackParams>;
  MainTabs: NavigatorScreenParams<MainTabParams>;
  PostDetail: { id: string };
  CreatePost: { circleId?: string } | undefined;
  UserProfile: { id: string };
  CircleDetail: { id: string };
  ChatRoom: { id: string };
  BoonAIChat: undefined;
  CreateEvent: undefined;
  EventDetail: { id: string };
  EditProfile: undefined;
  Settings: undefined;
  Subscription: undefined;
  GrowthHub: undefined;
  NeurodiversityHub: undefined;
  Therapists: undefined;
  Surrogacy: undefined;
  LanguagePicker: undefined;
  Notifications: undefined;
  GoLive: undefined;
  LiveViewer: { id: string };
};
