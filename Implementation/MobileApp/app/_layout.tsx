// app/_layout.tsx (root layout)
import { useEffect } from 'react';
import { useRouter, Stack } from 'expo-router';
import { SplashScreen } from 'expo-router';        // re-export of expo-splash-screen
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import '../global.css';
import * as Notifications from 'expo-notifications';


import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { LanguageProvider } from '@/context/LanguageProvider';


configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
}); //done this to enable animations without warnings

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,    // show banner for iOS
    shouldShowList: true,      // show in Notification Center (iOS 14+)
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {



  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationNavigator />
        <RootNavigator />
      </AuthProvider>
    </LanguageProvider>
  );
}

function NotificationNavigator() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  /* 1️⃣ cold-start */
  useEffect(() => {
    if (loading || !isAuthenticated) return;           // wait for auth

    (async () => {
      const resp = await Notifications.getLastNotificationResponseAsync();
      const meetingId = (resp?.notification.request.content.data as { meetingId?: string })?.meetingId;
      if (meetingId) {
        router.push({
          pathname: '/(tabs)/(Meetings)',
          params: { focusId: meetingId },
        });
      }
    })();
  }, [loading, isAuthenticated, router]);

  /* 2️⃣ taps while app is running */
  useEffect(() => {
    if (!isAuthenticated) return;                      // guard as well
    const sub = Notifications.addNotificationResponseReceivedListener(r => {
      const meetingId = (r.notification.request.content.data as { meetingId?: string })?.meetingId;
      if (meetingId) {
        router.push({
          pathname: '/(tabs)/(Meetings)',
          params: { focusId: meetingId },
        });
      }
    });
    return () => sub.remove();
  }, [isAuthenticated, router]);

  return null;    // renders nothing
}


function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* public routes */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      {/* private routes */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
