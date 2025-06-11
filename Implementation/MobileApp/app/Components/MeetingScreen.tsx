import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View, Text, TextInput, Pressable, Linking, ScrollView, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useKeyboard from "@/hooks/useKeyboard";
import { useState } from "react";

type Mode = 'pending' | 'ongoing';

export function MeetingScreen({
    data,
    mode,
    onPrimaryAction,
}: {
    data: {
        id: string;
        name?: string;
        phone?: string;
        address?: string;
        createdAt?: string;
    };
    mode: Mode;
    onPrimaryAction: () => void;
}) {
    const {
        name = 'Undefined',
        phone = 'Unknown',
        address = 'Unknown',
        createdAt,
    } = data;

    const SPARE = 64 + 124;
    const { isKeyboardOpen } = useKeyboard();
    const [inputHeight, setInputHeight] = useState(40);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAwareScrollView
                className="bg-[#F7EFDA] flex-1 pt-8 p8-4"
                scrollEnabled={!isKeyboardOpen}
                showsVerticalScrollIndicator={!isKeyboardOpen}
                contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center',
                    gap: 16,
                    minHeight: '100%',
                    paddingBottom: 24,
                }}
                extraScrollHeight={SPARE}
                enableOnAndroid

                keyboardShouldPersistTaps="handled"
            >
                <View className="w-[10rem] h-[10rem] rounded-full bg-[#658F8D] items-center justify-center shadow-md">
                    <Ionicons name="person" size={100} color="white" />
                </View>

                {mode === 'pending' ? (<Text className="text-lg text-[#426363]">{createdAt || ''}</Text>) : (<></>)}

                <View className='items-center gap-9 mt-4'>
                    <Text className="text-3xl font-bold text-[#426363]">{name}</Text>

                    <Pressable
                        onPress={() => Linking.openURL(`tel:${phone}`)}
                        className="flex-row items-center justify-center gap-3 rounded-full px-10 py-3 bg-[#ECECEC]  border border-[#C3B295] active:bg-[#E2ECEA] active:scale-95 elevation-sm"
                    >
                        <Ionicons name="call-sharp" size={24} color="#317B63" />
                        <Text className="text-2xl font-medium text-[#317B63]">
                            {phone}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            Linking.openURL(
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    address ?? ''
                                )}`
                            )
                        }
                        className="flex-row items-center justify-center gap-3 rounded-full px-10 py-3 bg-[#ECECEC] border border-[#C3B295] active:bg-[#E2ECEA] active:scale-95 elevation-sm">
                        <Ionicons name="location-sharp" size={24} color="#317B63" />
                        <Text className="text-2xl font-medium text-[#317B63]">
                            {address}
                        </Text>
                    </Pressable>
                </View>


                {mode === 'pending' ? (
                    <View className='flex-row w-[90%] justify-center gap-6 mt-auto'>


                        <TouchableOpacity
                            className="bg-[#DE8E86] px-8 py-3 rounded-3xl"
                            onPress={() => router.back()}
                        >
                            <Text className="text-white text-xl  font-semibold">Dismiss</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-[#6AA58F] px-8 py-3 rounded-3xl"
                            onPress={() => onPrimaryAction()}
                        >
                            <Text className="text-white text-xl font-semibold" >Accept</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TextInput
                            placeholder="Add description..."
                            multiline
                            textAlignVertical="top"
                            onContentSizeChange={(e) =>
                                setInputHeight(e.nativeEvent.contentSize.height)
                            }
                            style={{
                                height: Math.min(inputHeight, 200),
                                width: '90%',
                                backgroundColor: 'white',
                                borderRadius: 16,
                                padding: 12,
                                fontSize: 16,
                                borderColor: '#C3B295',
                                borderWidth: 1,
                                shadowColor: '#000',
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 2,
                                marginTop: 'auto'
                            }}
                        /> 
                        <TouchableOpacity
                            className="bg-[#6AA58F] px-8 py-3 rounded-3xl mt-auto"
                            onPress={onPrimaryAction}
                        >
                            <Text className="text-white text-xl font-semibold">
                                Finish Meeting
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
                <View style={{ height: 2 }} />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
export default MeetingScreen;