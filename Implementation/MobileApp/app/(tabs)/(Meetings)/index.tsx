import { ActivityIndicator, FlatList, View, Text, ScrollView, RefreshControl } from 'react-native';
import MeetingCard from '../../Components/MeetingCard';
import { useEffect, useState, useCallback } from 'react';
import { getMeetings } from '@/Services/Meetings';
import { useAuth } from '@/hooks/useAuth';
import { useFocusEffect } from 'expo-router';

type Meeting = {
  id: string;
  createdAt: Date;
  name: string;
  address: string;
  phone: string;          
};

export default function MeetingScreen() {
  const { userId } = useAuth();
  const [data, setData] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // 👈 new state
  const [error, setError] = useState<string | null>(null);


  const loadMeetings = useCallback(async () => {
    try {
      console.log('loading')
      const res = await getMeetings(userId || '');
      const meetings: Meeting[] = res.map((item: any) => ({
        id: item.id,
        name: `${item.first_name} ${item.last_name}`,
        address: item.address,
        phone: item.phone_number,   
        createdAt: new Date(item.createdAt),
      })).sort((a: Meeting, b: Meeting) => a.createdAt.getTime() - b.createdAt.getTime());;
      setData(meetings);
      setError(null);
    } catch (err: any) {
      setError('Failed to load meetings');
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        setLoading(true);
        await loadMeetings();
        if (isActive) setLoading(false);
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [loadMeetings])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeetings();
    setRefreshing(false);
  };

  const renderCard = ({ item }: { item: Meeting }) => (
    <MeetingCard
      {...item}
    />
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F7EFDA]">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView
        className="bg-[#F7EFDA]"
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-red-600">{error}</Text>
      </ScrollView>
    );
  }

  if (data.length === 0) {
    return (
      <ScrollView
        className="bg-[#F7EFDA]"
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-[#426363] text-3xl font-bold">No meetings available</Text>
      </ScrollView>
    );

  }

  return (
    <FlatList
      className="bg-[#F7EFDA]"
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderCard}
      numColumns={2}
      columnWrapperClassName="justify-evenly"
      contentContainerClassName="px-5 py-6 gap-y-6"
      refreshing={refreshing}         // 👈 enables pull-to-refresh
      onRefresh={onRefresh}           // 👈 what happens when user pulls
    />
  );
}
