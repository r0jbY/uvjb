// app/_layout.tsx (root layout)
import { useEffect}   from 'react';
import { Stack }       from 'expo-router';
import { SplashScreen } from 'expo-router';        // re-export of expo-splash-screen
import { AuthProvider } from '../context/AuthContext';
import { useAuth }      from '../hooks/useAuth';
import '../global.css';
import * as Notifications from 'expo-notifications';


import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';


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



   useEffect(() => {
    const sub1 = Notifications.addNotificationReceivedListener(n =>
      console.log('Notification received!', n)
    );
    const sub2 = Notifications.addNotificationResponseReceivedListener(r =>
      console.log('User responded to notification:', r)
    );
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
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
