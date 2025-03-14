import React from 'react';
import { StyleSheet, View, SafeAreaView, Image, Text, Button, TouchableOpacity, Linking } from 'react-native';
import { Card } from 'react-native-elements';

export default function InfoClient({ route, navigation }) {
    const _404 = () => {
        return (
            <SafeAreaView style={styles.container1}>
                <Text>U heeft geen verzoeken in het afgelopen uur</Text>
                <Button title="Nu zoeken!" onPress={() => navigation.navigate('Home')} />
            </SafeAreaView>
        );
    };

    const handlePress = (url) => {
        Linking.openURL(url).catch(err => console.error('Error occurred', err));
    };

    if (route.params === undefined) {
        return _404();
    }

    const { client } = route.params;

    if (Object.keys(client).length === 0) {
        return _404();
    }
    else {
        const { id, name, address, time } = client;
        const phoneNumberClient = "0031 06 28957718";
        const phoneNumberSuperBuddy = "0031 06 28957718";
        return (
            <SafeAreaView style={styles.container1}>
                <Card containerStyle={styles.Card}>
                    <Image source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} style={styles.image} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.text}>Adres: {address} </Text>
                        <TouchableOpacity onPress={() => handlePress(`tel:${phoneNumberClient}`)} style={styles.text}>
                            <Text>Tel nr client: <Text style={styles.buttonText}>{phoneNumberClient}</Text></Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress(`tel:${phoneNumberSuperBuddy}`)} style={styles.text}>
                            <Text>Tel nr supperbuddy: <Text style={styles.buttonText}>{phoneNumberSuperBuddy}</Text></Text>
                        </TouchableOpacity>
                        <Text style={styles.general}>Algemeen: Iets van info over de Client</Text>
                    </View>
                </Card>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    Card: {
        height: '70%',
        width: '90%',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        top: '-40%',
        alignSelf: 'center',
    },
    infoContainer: {
    },
    buttonText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});