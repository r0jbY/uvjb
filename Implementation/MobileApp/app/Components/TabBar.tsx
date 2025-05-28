import { View, Platform, TouchableOpacity } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function TabBar  ({ state, descriptors, navigation }: BottomTabBarProps) {

    const insets = useSafeAreaInsets();

    return (
        <View className={`absolute right-2 left-2  flex-row   rounded-[32] mx-4 elevation-md shadow-md justify-self-center bg-[#FFF7E8]`} style={{ bottom: insets.bottom + 8 }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}

                        className={`flex-1 min-h-[48px] py-3 px-4 items-center justify-center transition-all duration-200 active:scale-95 ${isFocused ? 'bg-[#E3E7DC] rounded-full' : ''}`}
                    >

                        <Ionicons
                            name={
                                route.name === 'index'
                                    ? 'people-outline'  // for meeting requests
                                    : route.name === 'history'
                                        ? 'time-outline' : route.name === 'profile' ? 'person-outline' :
                                            'ellipse-outline'              // default fallback
                            }
                            size={24}
                            color={isFocused ? '#4A7C59' : '#426363'}
                        />
                        <Text style={{ color: isFocused ? '#4A7C59' : '#426363' }}>
                            {typeof label === 'function'
                                ? label({
                                    focused: isFocused,
                                    color: isFocused ? 'red' : 'blue',
                                    position: 'below-icon',
                                    children: route.name,
                                })
                                : label}
                        </Text>

                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

