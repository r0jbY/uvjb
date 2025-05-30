import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

type ProfileFieldProps = {
  label?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  text?: string
};

export default function ProfileField({ label, icon, text }: ProfileFieldProps) {
    return (
        <View className="flex-row pl-3 py-2  items-center gap-3 w-[80%]  bg-white  rounded-[2rem] border border-[#C3B295] shadow-md elevation-md">
            <Ionicons name={`${icon ?? 'chevron-back'}`} size={24} color="#426363" style={{ padding: 2 }} />
            <View className="gap-1">
                <Text className="text-[#658F8D] font-bold text-lg">{label}</Text>
                <Text className="text-[#658F8D] font-regular text-lg">{text || "Nothing displayed yet"}</Text>
            </View>
            
        </View>
    )
}