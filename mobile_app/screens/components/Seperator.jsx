import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Seperator() {
    return <View style={styles.Seperator} />
}

const styles = StyleSheet.create({
    Seperator: {
        height: 2,
        width: '90%',
        backgroundColor: '#000',
        margin: 20,
        zIndex: -1,
    }
});