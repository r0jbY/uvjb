import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable, Linking, Alert, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import { acceptMeeting } from '@/Services/Meetings';
import { useAuth } from '@/hooks/useAuth';
import MeetingScreen from '../../Components/MeetingScreen';

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
      router.replace(
        `/(tabs)/(Meetings)/${meetingId}?name=${encodeURIComponent(name || '')}&address=${encodeURIComponent(address || '')}&phone=${encodeURIComponent(phone || '')}&createdAt=${encodeURIComponent(createdAt || '')}&accepted=${encodeURIComponent('true')}`
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MeetingScreen
      data={{ id: meetingId, name, phone, address, createdAt }}
      mode="ongoing"
      onPrimaryAction={handleAccept}   // accept → router.replace('/ongoing/id')
    />
  );
}
