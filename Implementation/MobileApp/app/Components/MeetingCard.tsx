import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";


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

const timeLabelFor = (created?: Date) => {
    if (!created) return '';
    const mins = Math.floor((Date.now() - created.getTime()) / 60_000);
    if (mins < 1) return 'Just now';
    if (mins === 1) return '1 min ago';
    return `${mins} min ago`;
};


type MeetingProps = {
    id: string;          // 👈 added
    createdAt?: Date;
    name?: string;
    address?: string;
    phone?: string;      // 👈 optional, pass it along
};

export default function MeetingCard({
    id,
    createdAt,
    name = 'Undefined',
    address = 'Undefined',
    phone,
}: MeetingProps) {

    const accent = useMemo(() => colourForDate(createdAt), [createdAt]);
    const time = useMemo(() => timeLabelFor(createdAt), [createdAt]);
    const router = useRouter();

    const handleVisit = () =>
        router.push({
            pathname: "/(tabs)/(Meetings)/[meetingId]",                 // absolute path to the dynamic route
            params: { meetingId: id, name, address, phone, createdAt: time },
        });

    return (
        <View className="relative w-[45%] h-72">
            <View
                pointerEvents="none"                      // touches go to the real card
                style={{ top: 7, borderColor: accent }}               // <── nudge ↓+→ 3 px
                className="absolute w-full h-full
               rounded-3xl border-8 border-red-500"
            />
            <View className=" bg-white rounded-3xl border-2 border-[#C3B295] p-0  items-center shadow-lg overflow-visible">





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
                        <Text className="text-center text-white font-semibold text-lg">Visit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}