import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Text } from '@react-navigation/elements';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Shadow } from 'react-native-shadow-2';


export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {

    const insets = useSafeAreaInsets();

    return (
        <Shadow
            distance={4}
            startColor="rgba(0,0,0,0.1)"
            sides={{ top: true }}
            corners={{ topStart: false, topEnd: false, bottomStart: false, bottomEnd: false }}
            stretch                      /* full-width nav bar */
        >
            <View className={`flex-row justify-around bg-[#F7EFDA] pt-1`} style={{
                paddingBottom: insets.bottom + 3
            }}  >

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

                            className={`flex-1 h-16 items-center justify-center transform active:scale-95 transition duration-150`}
                        >

                            <Ionicons
                                name={
                                    route.name === 'meetings'
                                        ? (isFocused ? 'people' : 'people-outline')
                                        : route.name === 'history'
                                            ? (isFocused ? 'time' : 'time-outline')
                                            : route.name === 'profile'
                                                ? (isFocused ? 'person' : 'person-outline')
                                                : (isFocused ? 'ellipse' : 'ellipse-outline')            // default fallback
                                }
                                size={isFocused ? 30 : 26}
                                color={isFocused ? '#426363' : '#A1A7A1'}
                            />
                            <Text style={{ color: isFocused ? '#426363' : '#A1A7A1', fontWeight: isFocused ? '700' : '400', fontSize: isFocused ? 14 : 13 }}>
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
        </Shadow>
    );
}

