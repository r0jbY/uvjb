import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function PushNotification() {
    const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    }, []);

    /**
     * Either use this function to test notifications or use the link: https://expo.dev/notifications
     * if using the link, make sure to use the expoToken of the test device (access token is not used in this version of the appd)
    */
    const sendNotification = async () => {
        const message = {
            to: expoPushToken,
            sound: "default",
            title: "Testing",
            body: "Testing body",
        };

        await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                host: "exp.host",
                accept: "application/json",
                "accept-encoding": "gzip, deflate",
                "content-type": "application/json",
            },
            body: JSON.stringify(message),
        });
    };

    return (
        <SafeAreaView style={{ marginTop: 100, alignItems: "center" }}>
            <View style={{ marginTop: 100, alignItems: "center" }}>
                <Button title="push" onPress={sendNotification} />
            </View>
        </SafeAreaView>
    );
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification! Please turn on the notifications for this app in your settings.');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId: '3227d7a4-de88-4ab5-a1a7-987b5eeff20c' })).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}
