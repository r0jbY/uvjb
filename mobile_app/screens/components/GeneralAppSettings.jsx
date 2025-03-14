import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

function getCurrentTheme() {
    // Implement code that gets the current safed theme
    // Should work like the JWT code
    // Might be needed higher up in the stack for the actual theme to be shown in every screen icluded the login
    return "Light";
}

function getCurrentLanguage() {
    // Implement code that gets the current safed theme
    // Should work like the JWT code
    // Might be needed higher up in the stack for the actual theme to be shown in every screen icluded the login
    return "NL";
}

export default function GeneralAppSettings() {
    // Theme settings
    const [themeOpen, setThemeOpen] = useState(false);
    const [themeValue, setThemeValue] = useState(getCurrentTheme());
    const [themeItems, setThemeItems] = useState([
        { label: 'Light', value: 'Light' },
        { label: 'Dark', value: 'Dark' },
        { label: 'Colour blind', value: 'Colour blind' },
    ]);

    // Language settings
    const [languageOpen, setLanguageOpen] = useState(false);
    const [languageValue, setLanguageValue] = useState(getCurrentLanguage());
    const [languageItems, setLanguageItems] = useState([
        { label: 'Nederlands', value: 'NL' },
        { label: 'English', value: 'EN' },
        { label: 'Français', value: 'FR' },
    ]);

    return (
        <View>
            <Text>Thema:</Text>
            <DropDownPicker
                open={themeOpen}
                value={themeValue}
                items={themeItems}
                setOpen={setThemeOpen}
                setValue={setThemeValue}
                setItems={setThemeItems}
                zIndex={2000}
                zIndexInverse={1000}
            />
            <Text>Taal:</Text>
            <DropDownPicker
                open={languageOpen}
                value={languageValue}
                items={languageItems}
                setOpen={setLanguageOpen}
                setValue={setLanguageValue}
                setItems={setLanguageItems}
                zIndex={1000}
                zIndexInverse={2000}
            />
        </View>
    );
}