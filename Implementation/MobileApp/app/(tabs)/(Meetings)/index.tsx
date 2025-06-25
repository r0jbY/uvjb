import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

import MeetingCard from '../../Components/MeetingCard';
import { getCurrentActiveMeeting, getMeetings } from '@/Services/Meetings';
import { useAuth } from '@/hooks/useAuth';

/* ──────────────────────────────────────────────────────────── */
/* Types                                                       */
/* ──────────────────────────────────────────────────────────── */
type Meeting = {
  id: string;
  createdAt: Date;
  name: string;
  address: string;
  phone: string;
};
type Query = { focusId?: string };

/* ──────────────────────────────────────────────────────────── */
/* Component                                                   */
/* ──────────────────────────────────────────────────────────── */
export default function MeetingScreen() {
  const { userId, loading: authLoading } = useAuth();
  const { focusId } = useLocalSearchParams<Query>();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

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


  /* UI / data state */
  const [data, setData] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* highlight state – only one card pulses */
  const [flashId, setFlashId] = useState<string | undefined>(focusId);

  /* ───── 1. fetch helper ───── */
  const loadMeetings = useCallback(async () => {
    if (!userId) return;                                 // wait for auth
    try {
      const res = await getMeetings(userId);
      const meetings: Meeting[] = res
        .map((item: any) => ({
          id: item.id,
          name: `${item.first_name} ${item.last_name}`,
          address: item.address,
          phone: item.phone_number,
          createdAt: new Date(item.createdAt),
        }))
        .sort((a: Meeting, b: Meeting) => a.createdAt.getTime() - b.createdAt.getTime());

      setData(meetings);
      setError(null);
    } catch {
      setError('Failed to load meetings');
    }
  }, [userId]);

  /* ───── 2. refresh whenever screen gains focus ───── */
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        await loadMeetings();
        if (alive) setLoading(false);
      })();

      return () => {
        alive = false;
        setFlashId(undefined);                     // clear highlight on blur
      };
    }, [loadMeetings])
  );

  /* ───── 3. silent refresh when a push arrives in foreground ───── */
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener(loadMeetings);
    return () => sub.remove();
  }, [loadMeetings]);

  /* ───── 4. highlight *exactly once*  ───── */
  useEffect(() => {
    if (!focusId || !data.length) return;          // nothing to do yet
    if (!data.some(m => m.id === focusId)) return; // id not in list

    setFlashId(focusId);                           // pulse now
    const t = setTimeout(() => {
      setFlashId(undefined);                       // stop highlight
      router.setParams({ focusId: undefined });    // remove query-param
    }, 9000);

    return () => clearTimeout(t);                  // cleanup on remount
  }, [focusId, data, router]);

  /* ───── 5. pull-to-refresh handler ───── */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeetings();                          // highlight already cleared
    setRefreshing(false);
  };

  /* ───── 6. UI states ───── */
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7EFDA]">
        <ActivityIndicator size="large" />
      </View>
    );
  }

   if (checking) {
    return <ActivityIndicator style={{ flex:1, backgroundColor:'#F7EFDA' }}/>
  }

  if (error) {
    return (
      <ScrollView
        className="bg-[#F7EFDA]"
        contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text className="text-red-600">{error}</Text>
      </ScrollView>
    );
  }

  if (data.length === 0) {
    return (
      <ScrollView
        className="bg-[#F7EFDA]"
        contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text className="text-[#426363] text-3xl font-bold">No meetings available</Text>
      </ScrollView>
    );
  }

  /* ───── 7. main list ───── */
  return (
    <FlatList
      className="bg-[#F7EFDA]"
      data={data}
      keyExtractor={(m) => m.id}
      renderItem={({ item }) => (
        <MeetingCard {...item} highlighted={item.id === flashId} />
      )}
      numColumns={2}
      columnWrapperClassName="justify-evenly"
      contentContainerClassName="px-5 py-6 gap-y-6"
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
