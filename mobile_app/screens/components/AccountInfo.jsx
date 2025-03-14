import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';

export default function AccountInfo({ userInfo, setEditMode }) {
    // ToDo: when editing it needs to send the updates to the database and only the userId should be in the parameters

    const [editable, setEditable] = useState(false);

    const [salutationOpen, setSalutationOpen] = useState(false);
    const [salutation, setSalutation] = useState(userInfo.salutation);
    const [allSalutation, setAllSalutation] = useState([
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Dr.', value: 'Dr.' },
    ]);

    const [firstName, setFirstName] = useState(userInfo.firstName);
    const [lastName, setLastName] = useState(userInfo.lastName);
    const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber);
    const [email, setEmail] = useState(userInfo.email);

    return (
        <View>
            {!editable ?
                (
                    <View>
                        <Text>Aanhef: {salutation}</Text>
                        <Text>Naam: {firstName}</Text>
                        <Text>Achternaam: {lastName}</Text>
                        <Text>Tel nr: {phoneNumber}</Text>
                        <Text>E-mail: {email}</Text>
                        <Button title="Edit account information" onPress={() => { setEditable(true), setEditMode(true) }} />
                    </View>
                )
                :
                (
                    <View>
                        <Text style={styles.label}>Aanhef</Text>
                        <DropDownPicker
                            open={salutationOpen}
                            value={salutation}
                            items={allSalutation}
                            setOpen={setSalutationOpen}
                            setValue={setSalutation}
                            setItems={setAllSalutation}
                            zIndex={2000}
                            zIndexInverse={1000}
                        />

                        <Text style={styles.label}>Naam</Text>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Enter your first name"
                        />

                        <Text style={styles.label}>Achternaam</Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter your last name"
                        />

                        <Text style={styles.label}>Tel nr</Text>
                        <TextInput
                            style={styles.input}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Enter your telephone number"
                            keyboardType="phone-pad"
                        />

                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />

                        <Button title="Save" onPress={() => { setEditable(false), setEditMode(false) }} />
                    </View>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        color: '#333',
    },
    picker: {
        height: 50,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});
