// app/ongoing/[meetingId].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import MeetingScreen from '../../Components/MeetingScreen';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { finishMeeting } from '@/Services/Meetings';
import Toast from 'react-native-toast-message';
import { useLanguage } from '@/context/LanguageProvider';

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
    const { t } = useLanguage();

    // optional fetch in case you need live data
    const [meeting, setMeeting] = useState<any>(null);


    // block Android hardware back

    useEffect(() => {
        if (!blockBack) return;
        const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => sub.remove(); // cleanup
    }, [blockBack]);

    const handleFinish = async (description = '') => {

        if (!description.trim()) {
            Toast.show({
                type: 'error',
                text1: t('meeting.finishDescriptionRequired'),
            });
            return;
        }

        try {
            await finishMeeting(meetingId, userId || "", description);
            console.log("Finished the meeting!");
            Toast.show({
                type: 'success',
                text1: t('meeting.finishSuccess'),
            });
            setTimeout(() => {
                setBlockBack(false); // ✅ allow back navigation again
                router.replace('/(tabs)/(Meetings)');
            }, 2000); // 2-second delay
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <MeetingScreen
            key={meetingId}
            data={{ id: meetingId, name, phone, address, createdAt }}
            mode="ongoing"
            onPrimaryAction={handleFinish}
        />
    );
}
