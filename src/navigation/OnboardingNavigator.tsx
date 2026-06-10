import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParams } from './types';
import WelcomeScreen from '@/screens/onboarding/WelcomeScreen';
import LanguageScreen from '@/screens/onboarding/LanguageScreen';
import LoginScreen from '@/screens/onboarding/LoginScreen';
import SignUpScreen from '@/screens/onboarding/SignUpScreen';
import ProfileSetupScreen from '@/screens/onboarding/ProfileSetupScreen';
import PersonalityScreen from '@/screens/onboarding/PersonalityScreen';
import LifeStageScreen from '@/screens/onboarding/LifeStageScreen';
import InterestsScreen from '@/screens/onboarding/InterestsScreen';
import IntentScreen from '@/screens/onboarding/IntentScreen';
import LookingForScreen from '@/screens/onboarding/LookingForScreen';
import AvailabilityScreen from '@/screens/onboarding/AvailabilityScreen';
import CircleSuggestionsScreen from '@/screens/onboarding/CircleSuggestionsScreen';
import NotificationsOptInScreen from '@/screens/onboarding/NotificationsOptInScreen';

const Stack = createNativeStackNavigator<OnboardingStackParams>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Personality" component={PersonalityScreen} />
      <Stack.Screen name="LifeStage" component={LifeStageScreen} />
      <Stack.Screen name="Interests" component={InterestsScreen} />
      <Stack.Screen name="Intent" component={IntentScreen} />
      <Stack.Screen name="LookingFor" component={LookingForScreen} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="CircleSuggestions" component={CircleSuggestionsScreen} />
      <Stack.Screen name="NotificationsOptIn" component={NotificationsOptInScreen} />
    </Stack.Navigator>
  );
}
