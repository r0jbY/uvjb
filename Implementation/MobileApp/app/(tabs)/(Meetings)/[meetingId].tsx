import {useLocalSearchParams, useRouter } from 'expo-router';
import { acceptMeeting } from '@/Services/Meetings';
import { useAuth } from '@/hooks/useAuth';
import MeetingScreen from '../../Components/MeetingScreen';
import Toast from 'react-native-toast-message';
import { useLanguage } from '@/context/LanguageProvider';

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
  const { t } = useLanguage();

  const handleAccept = async () => {
    try {

      await acceptMeeting(meetingId, userId || '');

      Toast.show({ type: 'success', text1: t('meeting.acceptSuccess') });

      setTimeout(() => {
        router.replace({
          pathname: '/(tabs)/(Meetings)/acceptedMeeting',   
          params: {
            meetingId,        
            name,
            phone,
            address,
            createdAt,       
          },
        });
      }, 2000); 


    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Meeting not found or already accepted / expired.") {
          Toast.show({ type: 'error', text1: t('meeting.acceptError') });
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
