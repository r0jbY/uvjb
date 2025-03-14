import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import { Card } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';

const handlePress = (url) => {
    Linking.openURL(url).catch(err => console.error('Error occurred', err));
};

export default function HistoryCard({ cardInfo }) {
    const { id, name, address, tel, telSB, accepted, note } = cardInfo;
    const date = accepted;
    const [showNotes, setShowNotes] = useState(false);

    return (
        <Card containerStyle={styles.card}>
            <View style={styles.head}>
                <Image source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} style={styles.image} />
                <Text style={styles.name}>{name}</Text>
            </View>
            <View style={styles.infoContainer} >
                <Text style={styles.Text}>{address}</Text>

                <TouchableOpacity onPress={() => handlePress(`tel:${tel}`)} style={styles.button}>
                    <Icon name="phone" size={15} color="blue" style={styles.Icon} />
                    <Text style={styles.buttonText}>Bel cliënt</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress(`tel:${telSB}`)} style={styles.button}>
                    <Icon name="phone" size={15} color="blue" style={styles.Icon} />
                    <Text style={styles.buttonText}>Bel superbuddy</Text>
                </TouchableOpacity>

                <Text style={styles.Text}>{accepted}</Text>

                {showNotes ? (
                    <Text>
                        {note}
                        <TouchableOpacity onPress={() => setShowNotes(false)} style={styles.button}>
                            <Text style={styles.buttonText}>Verberg notities</Text>
                        </TouchableOpacity>
                    </Text>
                ) : (
                    <TouchableOpacity onPress={() => setShowNotes(true)} style={styles.button}>
                        <Text style={styles.buttonText}>Bekijk notities</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
        width: '90%',
    },
    head: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
    },
    name: {
        flex: 1,
        left: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    Icon: {
        width: 15,
    },
    buttonText: {
        fontSize: 10,
        marginLeft: 10,
        color: 'blue',
        textDecorationLine: 'underline',
    },
});