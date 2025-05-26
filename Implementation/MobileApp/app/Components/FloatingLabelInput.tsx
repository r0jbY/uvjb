import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type FloatingLabelInputProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'visible-password' | 'url';
};

export default function FloatingLabelInput({
    label,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default'
}: FloatingLabelInputProps) {

    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const showLabel = isFocused || value.length > 0;
    const isPassword = secureTextEntry;


    return (
        <View className="relative w-full mb-4">
            {showLabel && (
                <Text className="absolute left-[8px] top-[7px] bg-transparent px-1 text-[10px] text-[#658F8D]/70  font-bold z-50">
                    {label}
                </Text>
            )}

            {isPassword && (
                <TouchableOpacity

                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-[12px] z-50">

                    <Feather
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={24}
                        color="#658F8D"
                    />

                </TouchableOpacity>
            )}

            <TextInput
                placeholder={showLabel ? '' : label}
                value={value}
                keyboardType={keyboardType}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                secureTextEntry={isPassword && !showPassword}
                className={`h-14 w-full rounded-full border border-[#C3B295] bg-[#F7F7F7] px-[11px] text-[#658F8D] ${showLabel ? 'pt-4 pb-0' : ''} placeholder:text-[#658F8D] placeholder:font-semibold`}

            />
        </View>
    );
}
