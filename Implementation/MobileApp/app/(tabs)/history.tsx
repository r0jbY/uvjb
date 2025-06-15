import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import MeetingHistoryCard from '../Components/MeetingHistoryCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import { getMeetingHistory } from '@/Services/Meetings';
import { useAuth } from '@/hooks/useAuth';
import { useFocusEffect } from 'expo-router';

export function getRelativeDate(dateString: string): string {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - createdDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

const mockData = [
  {
    id: '2e30a99a-34e4-4971-9e95-85862508ee4a',
    first_name: 'Alex',
    last_name: 'Pop',
    phone_number: '0760686187',
    address: 'Carpatilor 63',
    createdAt: '2025-06-13T9:20:15.549Z',
    description: 'It was fun! It was fun! It was fun!fun! It was fun! It was fun! It was fun! It was fun! It was fun!',
  },

  // ... add more items if needed
];

export default function HistoryScreen() {

  const insets = useSafeAreaInsets();

  const { userId } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchMeetingHistory = async () => {
        try {
          const res = await getMeetingHistory(userId || '');
          console.log(res);
          if (isActive) {
            setHistory(res);
          }
        } catch (err) {
          console.error('Failed to fetch meeting history:', err);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchMeetingHistory();

      return () => {
        isActive = false; // cleanup for async safety
      };
    }, [userId])
  );


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F7EFDA]">
        <ActivityIndicator size="large" color="#426363" />
        <Text className="mt-4 text-[#426363]">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#F7EFDA] p-8 gap-4"
      contentContainerStyle={{ paddingBottom: insets.bottom + 20, gap: 12 }}
    >
      {Array.isArray(history) &&
        [...history]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((item, index) => (
            <MeetingHistoryCard
              key={`${item.id}-${item.createdAt}-${index}`}
              first_name={item.first_name}
              last_name={item.last_name}
              phone_number={item.phone_number}
              address={item.address}
              description={item.description}
              createdAt={item.createdAt}
            />
          ))}
    </ScrollView>
  );
}
