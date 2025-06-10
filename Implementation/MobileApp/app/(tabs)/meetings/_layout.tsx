import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function MeetingsStack() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#F7EFDA' },
        headerTintColor: '#426363',
        headerTitleAlign: 'center',
        headerTitleStyle: { color: '#426363', fontWeight: 'bold', fontSize: 23 },
         headerLeft: () => (
              <TouchableOpacity style={{ paddingHorizontal: 16 }}>
                <Ionicons name="chevron-back" size={24} color="#426363" style={{ padding: 2 }} />

              </TouchableOpacity>
            ),
      }}
      
    >
      {/* List — no header */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Detail — shows back arrow automatically */}
      <Stack.Screen
        name="[meetingId]"
        options={{ title: 'Meeting', headerBackVisible: true }}   // can tweak more if you want
        
      />
    </Stack>
  );
}
