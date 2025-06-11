// app/ongoing/[meetingId].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import MeetingScreen from '../../Components/MeetingScreen';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

type Params = {
    meetingId: string;
    name?: string;
    phone?: string;
    address?: string;
    createdAt?: string;
};



export default function OngoingScreen() {
    const { meetingId, name, phone, address, createdAt } =
        useLocalSearchParams<Params>();
    const { userId } = useAuth();
    const router = useRouter();
    const [blockBack, setBlockBack] = useState(true);


    // optional fetch in case you need live data
    const [meeting, setMeeting] = useState<any>(null);


    // block Android hardware back

    useEffect(() => {
        if (!blockBack) return;

        const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => sub.remove(); // cleanup
    }, [blockBack]);

    const handleFinish = async (notes = '') => {
  setBlockBack(false); // ✅ allow back navigation again
  router.replace('/(tabs)/(Meetings)');
}

    return (
        <MeetingScreen
            key={meetingId}
            data={{ id: meetingId, name: 'alalala', phone, address, createdAt }}
            mode="ongoing"
            onPrimaryAction={handleFinish}
        />
    );
}
