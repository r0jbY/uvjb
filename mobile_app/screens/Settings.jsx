import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import AccountInfo from './components/AccountInfo';
import GeneralAppSettings from './components/GeneralAppSettings';
import Socials from './components/Socials';
import Seperator from './components/Seperator';

export default function Settings() {
    const userInfo = {
        salutation: "Mr.",
        firstName: "Steve",
        lastName: "Jackson",
        phoneNumber: "123-456-7890",
        email: "stevejackson@gmail.com",
    }

    const [editMode, setEditMode] = useState(false);
    return (
        <SafeAreaView style={styles.safeContainer}>
            <Text style={styles.h1}>Settings options</Text>
            <AccountInfo userInfo={userInfo} setEditMode={setEditMode} />
            {editMode ?
                <></>
                :
                <>
                    <Seperator />
                    <GeneralAppSettings />
                    <Seperator />
                    <Socials />
                </>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        margin: 20,
    },
    h1: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});