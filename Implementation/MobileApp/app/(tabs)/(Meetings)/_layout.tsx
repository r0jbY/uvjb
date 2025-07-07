import FloatingMenu     from '@/app/Components/FloatingMenu';
import { Ionicons }     from '@expo/vector-icons';
import { Tabs, useRouter, useFocusEffect } from 'expo-router';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useCallback, useState } from 'react';

import { useAuth }                   from '@/hooks/useAuth';
import { getCurrentActiveMeeting }   from '@/Services/Meetings';
import { useLanguage } from '@/context/LanguageProvider';

/* header-right shortcut */
const HeaderRight = () => <FloatingMenu />;

export default function MeetingsStack() {
  const router                     = useRouter();
  const { userId, loading: authLoading } = useAuth();

  const { t } = useLanguage();
  const [checking, setChecking] = useState(true);   // 🆕 gate state

  /* run every time Meetings tab gains focus */
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        if (authLoading || !userId) return;         // still logging-in

        try {
          const meeting = await getCurrentActiveMeeting(userId);
          if (alive && meeting) {
            setChecking(false);
            router.replace({
              pathname: '/(tabs)/(Meetings)/acceptedMeeting',
              params: {
                meetingId: meeting.id,
                name:      `${meeting.first_name} ${meeting.last_name}`,
                phone:     meeting.phone,
                address:   meeting.address,
                createdAt: meeting.createdAt,
              },
            });
          } else if (alive) {
            setChecking(false);                     // allow tabs to render
          }
        } catch (err) {
          console.warn('Failed to check active meeting:', err);
          if (alive) setChecking(false);
        }
      })();

      return () => { alive = false };
    }, [authLoading, userId, router])
  );

  /* ─── While we’re still checking, render nothing (or a spinner) ─── */
  if (checking) {
    return <ActivityIndicator style={{ flex:1, backgroundColor:'#F7EFDA' }}/>
  }

  /* ─── Tabs appear only after guard passes ─── */
  return (
    <Tabs
      screenOptions={{
        headerStyle:      { backgroundColor: '#F7EFDA' },
        headerTintColor:  '#426363',
        headerTitleAlign: 'center',
        headerTitleStyle: { color: '#426363', fontWeight: 'bold', fontSize: 23 },
        headerRight:      HeaderRight,
        tabBarStyle:      { display: 'none' },
      }}
    >
      <Tabs.Screen
  name="index"
  options={{ title: t('meetingsTabs.meetingsTitle'), headerShown: true }}
/>

<Tabs.Screen
  name="[meetingId]"
  options={{
    title: t('meetingsTabs.meetingTitle'),
    headerShown: true,
    headerLeft: () => (
      <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
        <Ionicons name="chevron-back" size={24} color="#426363" />
      </TouchableOpacity>
    ),
  }}
/>

<Tabs.Screen
  name="acceptedMeeting"
  options={{ title: t('meetingsTabs.ongoingMeetingTitle'), headerShown: true }}
/>
    </Tabs>
  );
}
