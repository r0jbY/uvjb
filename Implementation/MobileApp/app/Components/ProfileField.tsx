import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

type ProfileFieldProps = {
    label?: string;
    icon?: React.ComponentProps<typeof Ionicons>["name"];
    text?: string
};

export default function ProfileField({ label, icon, text }: ProfileFieldProps) {

    const [isEditing, setIsEditing] = useState(false);

    return (
        <View className="flex-row px-3 py-2   items-center gap-3 w-[80%]  bg-white  rounded-[2rem] border border-[#C3B295] shadow-md elevation-md">
            <Ionicons name={`${icon ?? 'chevron-back'}`} size={24} color="#426363" style={{ padding: 2 }} />
            <View className="gap-1 flex-1">
                <Text className="text-[#658F8D] font-bold text-lg">{label}</Text>
                {isEditing ? (
                    <TextInput autoFocus value={text} className="flex-1  text-[#658F8D] font-regular text-lg p-1"/>
                ) : (
                    <Text className="text-[#658F8D] font-regular text-lg">{text || "Nothing displayed yet"}</Text>
                )}
            </View>
            <TouchableOpacity className="" onPress={() => setIsEditing(!isEditing)}>
                <Ionicons name={isEditing ? 'checkmark' : 'pencil'} size={24} color="#426363" style={{ padding: 2 }} />
            </TouchableOpacity>
        </View>
    )
}