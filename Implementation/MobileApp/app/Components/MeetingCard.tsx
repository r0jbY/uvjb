import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useLanguage } from '@/context/LanguageProvider';


const AGE_LIMIT_MIN = { FRESH: 5, INTERMEDIATE: 12 };   // minutes
const TIER_COLOURS = {
    FRESH: "#B7D9B0",   // mint
    INTERMEDIATE: "#FFD08A",   // amber
    URGENT: "#F15C4B"    // coral
};

const colourForDate = (created?: Date) => {
    if (!created) return TIER_COLOURS.FRESH;        // fallback
    const mins = (Date.now() - created.getTime()) / 60_000;

    if (mins <= AGE_LIMIT_MIN.FRESH) return TIER_COLOURS.FRESH;
    if (mins <= AGE_LIMIT_MIN.INTERMEDIATE) return TIER_COLOURS.INTERMEDIATE;
    return TIER_COLOURS.URGENT;
};




type MeetingProps = {
    id: string;          // 👈 added
    createdAt?: Date;
    name?: string;
    address?: string;
    phone?: string;      // 👈 optional, pass it along
    highlighted?: boolean;
};

export default function MeetingCard({
    id,
    createdAt,
    name = 'Undefined',
    address = 'Undefined',
    phone,
    highlighted = false
}: MeetingProps) {

    const timeLabelFor = (created?: Date, t?: any) => {
        if (!created || !t) return '';
        const mins = Math.floor((Date.now() - created.getTime()) / 60_000);
        if (mins < 1) return t('meetingCard.justNow');
        if (mins === 1) return t('meetingCard.oneMinAgo');
        return t('meetingCard.minAgo', { count: mins });
    };

    const { t } = useLanguage();

    const accent = useMemo(() => colourForDate(createdAt), [createdAt]);
    const time = useMemo(() => timeLabelFor(createdAt, t), [createdAt, t]);
    const router = useRouter();



    const pulse = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!highlighted) return;

        const seq = Animated.sequence([
            Animated.timing(pulse, {
                toValue: 1,
                duration: 1500,                           // ⬅️ slower
                easing: Easing.bezier(0.4, 0, 0.2, 1),    // smooth ease-in-out
                useNativeDriver: false,
            }),
            Animated.timing(pulse, {
                toValue: 0,
                duration: 1500,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: false,
            }),
        ]);

        Animated.loop(seq, { iterations: 3 }).start(() => {
            // force-reset
            pulse.setValue(0);          // → borderWidth goes back to 1
        });
    }, [highlighted, pulse]);

    /* Colour and thickness */
    const borderColor = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: ['#C3B295', '#FFF44F'], // beige → vivid gold
    });
    const borderWidth = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 8],               // grows while brightening
    });
    const handleVisit = () =>
        router.push({
            pathname: "/(tabs)/(Meetings)/[meetingId]",                 // absolute path to the dynamic route
            params: { meetingId: id, name, address, phone, createdAt: time },
        });

    return (
        <View className="relative w-[45%] h-72">
            <Animated.View
                pointerEvents="none"                      // touches go to the real card
                style={{ top: 7, borderColor: accent, }}               // <── nudge ↓+→ 3 px
                className="absolute w-full h-full
               rounded-3xl border-8 "
            />
            <Animated.View
                style={{
                    borderColor: highlighted ? borderColor : '#C3B295',
                    borderWidth: highlighted ? borderWidth : 2  // beige when not highlighted
                }}
                className="bg-white rounded-3xl border-2 p-0 items-center shadow-lg overflow-visible"
            >





                {!!time && (
                    <Text className="absolute top-2 right-3 text-xs font-semibold text-[#426363]">
                        {time}
                    </Text>
                )}

                <View className="w-full h-full items-center pt-5 pb-2 justify-between  border-[#F15C4B]">
                    <View className="w-[4.4rem] h-[4.4rem] rounded-full bg-[#658F8D] items-center justify-center shadow-md">
                        <Ionicons name="person" size={44} color="white" />
                    </View>
                    <Text numberOfLines={2} className="font-semibold text-[#658F8D] text-xl text-center">
                        {name}
                    </Text>
                    <Text numberOfLines={2} className="font-semibold text-[#658F8D] text-base leading-snug text-center">
                        {address}
                    </Text>
                    <TouchableOpacity
                        style={{ backgroundColor: accent }}
                        className={` px-8 py-1 rounded-full  active:scale-95`}
                        onPress={handleVisit}
                    >
                        <Text className="text-center text-white font-semibold text-lg">{t('meetingCard.visit')}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}