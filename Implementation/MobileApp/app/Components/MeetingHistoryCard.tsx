import { View, Text, Image } from 'react-native';
import turtle from '../../assets/turtle.png'

function getRelativeDate(dateString: string): string {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
}

type Props = {
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    description: string;
    createdAt: string;
};

export default function MeetingHistoryCard({
    first_name,
    last_name,
    phone_number,
    address,
    description,
    createdAt,
}: Props) {
    return (
        <View
            className="bg-white rounded-3xl p-5  shadow-md elevation-md gap-2"
            style={{
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
            }}
        >
            <View className="flex-row p-4 gap-4">
                {/* Image wrapper */}
                <View className="items-center justify-center">
                    <View className="border-2 border-[#658F8D] rounded-full p-1">
                        <Image
                            source={turtle}
                            className="w-28 h-28 rounded-full"
                        />
                    </View>
                </View>

                {/* Text content - fills remaining space */}
                <View className="flex-1 justify-center gap-1 rounded-xl p-2">
                    <Text className="text-xl font-bold text-[#426363] text-center">
                        {first_name} {last_name}
                    </Text>

                    <Text className="text-base text-[#317B63] mt-1 text-center">
                        📞  {phone_number}
                    </Text>

                    <Text className="text-base text-[#317B63] mt-1 text-center">
                        📍  {address}
                    </Text>
                </View>
            </View>
            <Text className="text-base text-[#555]  text-justify">
                Description: {description}
            </Text>

            <Text className="text-sm text-[#999] text-right">
                {getRelativeDate(createdAt)}
            </Text>
        </View>
    );
}
