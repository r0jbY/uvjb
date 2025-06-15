import FloatingMenu from '@/app/Components/FloatingMenu';
import { Ionicons } from '@expo/vector-icons';
import { Stack, Tabs, usePathname } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useFonts } from "expo-font";
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { getCurrentActiveMeeting } from '@/Services/Meetings';


function HeaderRight() {
  return <FloatingMenu />;
}

export default function MeetingsStack() {
  const router = useRouter();
  const { userId, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !userId) return;

    if (pathname.includes('acceptedMeeting')) return;

    (async () => { 
      try {
        const meeting = await getCurrentActiveMeeting(userId);
        if (meeting) {
          router.replace({
            pathname: '/(tabs)/(Meetings)/acceptedMeeting',
            params: {
              meetingId: meeting.id,
              name: `${meeting.first_name} ${meeting.last_name}`,
              phone: meeting.phone,
              address: meeting.address,
              createdAt: meeting.createdAt,
            },
          }); 
        }
      } catch (err) {
        console.warn('Failed to check active meeting:', err);
      }
    })();
  }, [userId, loading]);

  return (
    <Tabs

      screenOptions={{
        headerStyle: {
          backgroundColor: "#F7EFDA",
        },
        headerTintColor: "#426363",
        headerTitleAlign: "center",
        headerTitleStyle: { color: "#426363", fontWeight: "bold", fontSize: 23 },
        headerRight: () => <HeaderRight />,
        tabBarStyle: { display: 'none' }
      }}
    >


      <Tabs.Screen name="index" options={{ title: "Meetings", headerShown: true, headerRight: () => <HeaderRight />, }} />

      <Tabs.Screen
        name="[meetingId]"
        options={{
          title: 'Meeting', headerShown: true, headerRight: () => <HeaderRight />, headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
              <Ionicons name="chevron-back" size={24} color="#426363" style={{ padding: 2 }} />

            </TouchableOpacity>
          ),
        }}   // can tweak more if you want

      />

      <Tabs.Screen
        name="acceptedMeeting"
        options={{ title: 'Ongoing Meeting', headerShown: true, headerRight: () => <HeaderRight /> }}   // can tweak more if you want

      />


    </Tabs>
  );
}


