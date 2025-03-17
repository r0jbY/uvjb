import React from 'react';
import { StyleSheet, View, Text, Image, Button } from 'react-native';
import { Card } from 'react-native-elements';

export default function ConfirmationCard({ data }) {
    const { id, name, address, time } = data;
    return (
        <Card containerStyle={styles.card}>
            <Image source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.address}>{address}</Text>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
        width: '90%',
        height: '90%',
    },
    image: {
        width: '100%',
        height: 150,
    },
    infoContainer: {
        padding: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 10,
    },
});