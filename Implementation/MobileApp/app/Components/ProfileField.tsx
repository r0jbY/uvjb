import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import useKeyboard from "@/hooks/useKeyboard";

type ProfileFieldProps = {
    label?: string;
    icon?: React.ComponentProps<typeof Ionicons>["name"];
    text?: string
    setText: React.Dispatch<React.SetStateAction<string>>
};

export default function ProfileField({ label, icon, text, setText }: ProfileFieldProps) {

    const [isEditing, setIsEditing] = useState(false);
    const { isKeyboardOpen } = useKeyboard();

    useEffect(() => {
        if (!isKeyboardOpen && isEditing) setIsEditing(false);
    }, [isKeyboardOpen]);

    return (
        <View className="flex-row px-3 py-2  items-center gap-3 w-[80%]  bg-white  rounded-[2rem] border border-[#C3B295] shadow-md elevation-md">
            <Ionicons name={`${icon ?? 'chevron-back'}`} size={24} color="#426363" style={{ padding: 2 }} />
            <View className="gap-1 flex-1">
                <Text className="text-[#658F8D] font-bold text-lg">{label}</Text>
                {isEditing ? (
                    <TextInput autoFocus value={text} onChangeText={setText} onBlur={() => setIsEditing(false)} className="flex-1  text-[#658F8D] font-regular text-lg p-1 pl-0" />
                ) : (
                    <Text className="text-[#658F8D] font-regular text-lg">{text || "Nothing displayed yet"}</Text>
                )}
            </View>
            <TouchableOpacity className="" onPress={() => setIsEditing(!isEditing)}>
                <Ionicons name={isEditing  ? 'checkmark' : 'pencil'} size={24} color="#426363" style={{ padding: 2 }} />
            </TouchableOpacity>
        </View>
    )
}