import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Socials() {
    const phoneNumber = '123-456-7890';
    const websiteUrl = 'https://example.com';
    const instagramUrl = 'https://instagram.com/yourprofile';
    const email = 'example@example.com';

    const handlePress = (url) => {
        Linking.openURL(url).catch(err => console.error('Error occurred', err));
    };

    return (
        <View style={styles.socialsContainer}>
            <View style={styles.col}>
                <TouchableOpacity onPress={() => handlePress(`tel:${phoneNumber}`)} style={styles.button}>
                    <Icon name="phone" size={30} color="blue" style={styles.Icon} />
                    <Text style={styles.buttonText}>{phoneNumber}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress(websiteUrl)} style={styles.button}>
                    <Icon name="globe" size={30} color="blue" style={styles.Icon} />
                    <Text style={styles.buttonText}>Website</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.col}>
                <TouchableOpacity onPress={() => handlePress(`mailto:${email}`)} style={styles.button}>
                    <Icon name="envelope" size={30} color="blue" style={styles.Icon} />
                    <Text style={styles.buttonText}>{email}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress(instagramUrl)} style={styles.button}>
                    <Icon name="instagram" size={30} color="blue" style={styles.Icon} />
                    <Text style={styles.buttonText}>Instagram</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    socialsContainer: {
        flexDirection: 'row',
        width: '95%',
        alignSelf: 'center',
        zIndex: -1,
    },
    col: {
        flexDirection: 'colomn',
        justifyContent: 'space-around',
        width: '45%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    Icon: {
        width: 30,
    },
    buttonText: {
        fontSize: 10,
        marginLeft: 10,
        color: 'blue',
        textDecorationLine: 'underline',
    },
});