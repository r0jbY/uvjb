// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, TouchableOpacity } from 'react-native';
import FloatingMenu from '../Components/FloatingMenu';
import { useState } from 'react';

export default function TabLayout() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#F7EFDA"
        },
        headerTitleAlign: 'center',
        headerTintColor: '#426363',    // Back arrow and icon color
        headerTitleStyle: {
          color: '#426363',             // Title color
          fontWeight: 'bold',           // Optional
          fontSize: 23,                 // Optional
          // Must match loaded font name
        },
        tabBarActiveTintColor: '#333',
        headerRight: () => {
          const router = useRouter();
          return (
            <FloatingMenu/>
          )
        },
      }}


    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Open Requests',
          headerLeft: () => (
            <TouchableOpacity  style={{ paddingHorizontal: 16 }}>
              <Ionicons name="chevron-back" size={24} color="#426363" style={{padding: 2}} />

            </TouchableOpacity>
          ),
        }}

      />
      <Tabs.Screen
        name="history"
        options={{ title: 'History' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}
