// app/_layout.tsx (root layout)
import { useEffect }   from 'react';
import { Stack }       from 'expo-router';
import { SplashScreen } from 'expo-router';        // re-export of expo-splash-screen
import { AuthProvider } from '../context/AuthContext';
import { useAuth }      from '../hooks/useAuth';
import '../global.css';

// ⬅︎ keep it visible right away (runs before React mounts)

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
