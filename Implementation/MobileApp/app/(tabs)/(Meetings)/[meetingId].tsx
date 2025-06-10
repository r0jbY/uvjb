import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable, Linking, Alert } from 'react-native';
import axios from 'axios';

export default function MeetingDetail() {
  const { meetingId } = useLocalSearchParams<{ meetingId: string }>();
  const router = useRouter();

  // Ideally you’d fetch the meeting again here, or pass full data via router.push()
  // For brevity I'll assume you passed everything in route params:
  

  const handle = async (action: 'accept' | 'cancel') => {
    try {
      await axios.post(`${process.env.API_URL}/meetings/${meetingId}/${action}`);
      Alert.alert('Success', action === 'accept' ? 'Meeting accepted' : 'Meeting dismissed');
      router.back();      // list refreshes via useFocusEffect already in place
    } catch {
      Alert.alert('Error', 'Please try again');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#F7EFDA] px-6 gap-6">
      {/* — avatar / name / createdAt section — */}
      <Text className="text-2xl font-bold text-[#426363]">a</Text>

      <Pressable onPress={() => Linking.openURL(`tel:$`)}>
        <Text className="text-lg text-[#426363]">📞 a</Text>
      </Pressable>

      <Pressable
        onPress={() =>
          Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('address')}`)
        }
      >
        <Text className="text-lg text-[#426363]">📍 a</Text>
      </Pressable>

      <Pressable className="bg-[#6AA58F] px-8 py-3 rounded-2xl" onPress={() => handle('accept')}>
        <Text className="text-white font-semibold">Accept</Text>
      </Pressable>

      <Pressable className="bg-[#DE8E86] px-8 py-3 rounded-2xl" onPress={() => handle('cancel')}>
        <Text className="text-white font-semibold">Dismiss</Text>
      </Pressable>
    </View>
  );
}
