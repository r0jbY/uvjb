import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Pressable, TouchableOpacity, View, Text, Alert } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { Portal } from "react-native-portalize";
import axios from "../axiosConfigs"
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { useAuth } from "@/hooks/useAuth";
import ConfirmModal from "./ConfirmModal";
import { useFocusEffect, useNavigation } from "expo-router";
import { getExpoPushToken } from "@/utils/push";
import i18n from '@/locales/i18n';
import { emitLangChanged } from "@/locales/i18nEvent";
import { useLanguage } from "@/context/LanguageProvider";

export default function FloatingMenu() {

    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
    const [show, setShow] = useState(false);
    const menuAnimation = useSharedValue(0);
    const { refreshAuth, userId } = useAuth();
    const [isFocused, setIsFocused] = useState(true);
    const { lang, setLang, t } = useLanguage();
    const other = lang === 'en' ? 'nl' : 'en';

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setMenuVisible(false);
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const onFocus = navigation.addListener("focus", () => setIsFocused(true));
        const onBlur = navigation.addListener("blur", () => setIsFocused(false));
        return () => { onFocus(); onBlur(); };
    }, [navigation]);


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
        const token = await getExpoPushToken();

        if (token) {
            try {
                await axios.delete(`/notifications/removeToken`, {
                    data: { id: userId, token },
                });
            } catch (e) {
                console.warn('Failed to remove push token', e);
            }
        }
        await SecureStore.deleteItemAsync('refreshToken');
        await refreshAuth();
    }



    return (
        <>
            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={{ paddingHorizontal: 16 }} className='active:scale-95 transition-all duration-200 px-4'>
                <Ionicons name={menuVisible ? 'remove-circle-outline' : 'ellipsis-horizontal'} size={28} color="#426363" style={{ padding: 2 }} />
            </TouchableOpacity>

            {shouldRenderMenu && (
                <Portal>
                    <Animated.View className="absolute w-fit  gap-2 top-[70] right-3 bg-[#FFF7E8] rounded-2xl shadow-lg shadow-[rgba(0,0,0,0.05)] py-2 z-50" style={animatedMenuStyle}>
                        <Pressable
                            onPress={() => setLang(other as 'en' | 'nl')}
                            className="px-4 flex-row items-center gap-3 p-4 active:opacity-75 active:scale-95"
                        >
                            <Ionicons name="language-outline" size={20} color="#4D6F70" />
                            <Text className="text-[#4D6F70] font-medium">
                                {t('floatingMenu.switchLabel', {
                                    lang: other === 'en' ? t('floatingMenu.english') : t('floatingMenu.dutch')
                                })}
                            </Text>
                        </Pressable>  
                        <Pressable
                            onPress={() => { setShow(true); }}
                            className="px-4 flex-row items-center gap-3 p-4 active:opacity-75 active:scale-95 transition-all duration-150"
                        >
                            <Ionicons name="log-out-outline" size={20} color="#A04030" />
                            <Text className="text-red-600 font-medium">{t('floatingMenu.logout')}</Text>
                        </Pressable>


                        <ConfirmModal
                            visible={show}
                            onCancel={() => setShow(false)}
                            onConfirm={() => {
                                setShow(false);
                                logout();
                            }}
                            title={t('floatingMenu.logoutTitle')}
                            message={t('floatingMenu.logoutMessage')}
                        />
                    </Animated.View>
                </Portal>
            )}
        </>
    );
}
