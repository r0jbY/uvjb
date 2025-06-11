import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable, Linking, Alert, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import { acceptMeeting } from '@/Services/Meetings';
import { useAuth } from '@/hooks/useAuth';
import MeetingScreen from '../../Components/MeetingScreen';
import Toast from 'react-native-toast-message';

type Params = {
  meetingId: string;   // from the [meetingId] segment
  name?: string;       // all query-string params come through as strings
  address?: string;
  phone?: string;
  createdAt?: string;
  accepted?: string
};


export default function MeetingDetail() {
  const { meetingId, name, address, phone, createdAt, accepted = 'false' } = useLocalSearchParams<Params>();
  const router = useRouter();
  const { userId } = useAuth();

  const handleAccept = async () => {
    try {
      console.log('Pressed');
      await acceptMeeting(meetingId, userId || '');
      router.replace({
        pathname: '/(tabs)/(Meetings)/acceptedMeeting',   // target route
        params: {
          meetingId,        // dynamic segment
          name,
          phone,
          address,
          createdAt,        // must be a string
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Meeting not found or already accepted / expired.") {
          Toast.show({ type: 'error', text1: "Meeting not found or already accepted / expired." });
          setTimeout(() => {
            router.back();
          }, 1000);
        }
      }
      console.log(error);
    }
  }

  return (
    <MeetingScreen
      data={{ id: meetingId, name, phone, address, createdAt }}
      mode="pending"
      onPrimaryAction={handleAccept}   // accept → router.replace('/ongoing/id')
    />
  );
}
