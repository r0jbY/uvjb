import FloatingMenu from '@/app/Components/FloatingMenu';
import { Ionicons } from '@expo/vector-icons';
import { Stack, Tabs } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useFonts } from "expo-font";
import { useRouter } from 'expo-router';

function HeaderRight() {
  return <FloatingMenu />;
}

export default function MeetingsStack() {
  const router = useRouter();

  return (
      <Tabs
      
        screenOptions={{
          headerStyle: { 
            backgroundColor: "#F7EFDA",
            // overflow: "visible",   // 👈 allow the menu to spill over
            
          },
          headerTintColor: "#426363",
          headerTitleAlign: "center",
          headerTitleStyle: { color: "#426363", fontWeight: "bold", fontSize: 23 },
          headerRight: () => <HeaderRight />,
          tabBarStyle: { display: 'none' }
        }}
      >
      

        <Tabs.Screen name="index" options={{ title: "Meetings", headerShown: true, headerRight: () => <HeaderRight />,  }} />

        <Tabs.Screen
          name="[meetingId]"
          options={{ title: 'Meeting',  headerShown: true, headerRight: () => <HeaderRight />, headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
                <Ionicons name="chevron-back" size={24} color="#426363" style={{ padding: 2 }} />

              </TouchableOpacity>
            ), }}   // can tweak more if you want

        />

        
      </Tabs>
  );
}
