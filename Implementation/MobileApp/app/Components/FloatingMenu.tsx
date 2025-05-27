import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, TouchableOpacity, View, Text, Alert } from "react-native";
import * as SecureStore from 'expo-secure-store';

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,

    runOnJS,
} from 'react-native-reanimated';
import { useAuth } from "@/hooks/useAuth";
import ConfirmLogoutModal from "./ConfirmModal";


export default function FloatingMenu() {

    const [menuVisible, setMenuVisible] = useState(false);
    const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
    const [show, setShow] = useState(false);
    const menuAnimation = useSharedValue(0);
    const { refreshAuth } = useAuth();



    const animatedMenuStyle = useAnimatedStyle(() => ({
        opacity: menuAnimation.value,
        transform: [{ scale: menuAnimation.value }],
    }));

    useEffect(() => {
        if (menuVisible) {
            setShouldRenderMenu(true);
            menuAnimation.value = withTiming(1, { duration: 200 });
        } else {
            // Animate out, then unmount
            menuAnimation.value = withTiming(0, { duration: 200 }, (finished) => {
                if (finished) {
                    runOnJS(setShouldRenderMenu)(false);
                }
            });
        }
    }, [menuVisible]);

    const logout = async () => {
        await SecureStore.deleteItemAsync('refreshToken');
        await refreshAuth();
    }

   

    return (
        <>
            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={{ paddingHorizontal: 16 }} className='active:scale-95 transition-all duration-200 px-4'>
                <Ionicons name={menuVisible ? 'remove-circle-outline' : 'ellipsis-horizontal'} size={28} color="#426363" style={{ padding: 2 }} />
            </TouchableOpacity>

            {shouldRenderMenu && (
                <Animated.View className="absolute w-40  gap-2 top-[58] right-3 bg-[#FFF7E8] rounded-2xl shadow-lg shadow-[rgba(0,0,0,0.05)] py-2 z-50" style={animatedMenuStyle}>
                    <Pressable

                        className="px-4 flex-row items-center gap-3 p-4 active:opacity-75 active:scale-95 transition-all duration-200"
                    >
                        <Ionicons name="settings-outline" size={20} color="#4D6F70" />
                        <Text className="text-[#4D6F70] font-medium">Settings</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setShow(true);


                        }}
                        className="px-4 flex-row items-center gap-3 p-4 active:opacity-75 active:scale-95 transition-all duration-150"
                    >
                        <Ionicons name="log-out-outline" size={20} color="#A04030" />
                        <Text className="text-red-600 font-medium">Log out</Text>
                    </Pressable>

                    <ConfirmLogoutModal
                        visible={show}
                        onCancel={() => setShow(false)}
                        onConfirm={() => {
                            setShow(false);
                            logout();
                        }}
                    />
                </Animated.View>
            )}
        </>
    );
}
