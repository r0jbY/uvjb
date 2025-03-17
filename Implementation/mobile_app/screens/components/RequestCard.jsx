import React from 'react';
import { StyleSheet, View, Text, Image, Button, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';

export default function RequestCard({ data, showConfirmation }) {
    const { id, name, address, time } = data;
    const visit = () => {
        showConfirmation(id);
    }
    return (
        <TouchableOpacity style={styles.touchCard} onPress={visit}>
            <Card containerStyle={styles.card}>
                <Image source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.address}>{address}</Text>
                    <Button title="Bezoek" onPress={visit} />
                </View>
            </Card>
        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({
    touchCard: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
        width: '45%',
    },
    card: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: 100,
        height: 100,
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