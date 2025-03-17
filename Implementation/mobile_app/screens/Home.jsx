import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, Modal, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { getItem } from '../persiststorage/AsyncStorage';
import RequestCard from './components/RequestCard';
import ConfirmationCard from './components/ConfirmationCard';

const dataSet = [
    {
        id: "1a",
        name: "Ming",
        address: "street 2",
        time: "12:04",
    },
    {
        id: "2a",
        name: "Kai",
        address: "street 2",
        time: "12:05",
    },
    {
        id: "3a",
        name: "Cai",
        address: "street 2",
        time: "12:06",
    },
    {
        id: "4a",
        name: "Sen",
        address: "street 2",
        time: "12:07",
    },
    {
        id: "5a",
        name: "Ron",
        address: "street 2",
        time: "12:08",
    },
    {
        id: "6a",
        name: "Nick",
        address: "street 2",
        time: "12:09",
    },
    {
        id: "7a",
        name: "Ming",
        address: "street 2",
        time: "12:04",
    },
    {
        id: "8a",
        name: "Kai",
        address: "street 2",
        time: "12:05",
    },
    {
        id: "9a",
        name: "Cai",
        address: "street 2",
        time: "12:06",
    },
    {
        id: "10a",
        name: "Sen",
        address: "street 2",
        time: "12:07",
    },
    {
        id: "11a",
        name: "Ron",
        address: "street 2",
        time: "12:08",
    },
    {
        id: "12a",
        name: "Nick",
        address: "street 2",
        time: "12:09",
    },
];

export default function Home({ navigation }) {
    const [token, setToken] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalProfile, setModalProfile] = useState({});
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = () => {
        setData(dataSet);
        setRefreshing(false);
    };
    const onRefresh = () => {
        setRefreshing(true);
        fetchData(); // Fetch data again when pull-to-refresh is triggered
    };


    useEffect(() => {
        async function getToken() {
            const jwt = await getItem("jwt");
            setToken(jwt);
        }
        getToken();
        fetchData();
    }, []);

    const showConfirmation = (id) => {
        setModalProfile(data.find((obj) => obj.id === id));
        setModalVisible(true);
    };

    const handleYes = () => {
        setModalVisible(false);
        navigation.navigate('InfoClient', { client: modalProfile });
    };
    const handleNo = () => {
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container1}>
            <FlatList
                data={data}
                renderItem={({ item }) => <RequestCard data={item} showConfirmation={showConfirmation} />}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={handleNo}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Weet u het zeker?</Text>
                        <ConfirmationCard data={modalProfile} />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.button, styles.yes]} onPress={handleYes}>
                                <Text style={[styles.buttonText, styles.TextYes]}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.no]} onPress={handleNo}>
                                <Text style={[styles.buttonText, styles.TextNo]}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    container2: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    list: {
        paddingHorizontal: 10,
    },
    row: {
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        marginTop: 200,
        marginLeft: 20,
        marginRight: 20,
        height: '50%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    button: {
        borderWidth: 4,
        borderRadius: 10,
        padding: 10,
        margin: 5,
        elevation: 2,
        flex: 1,
        alignItems: 'center',
    },
    yes: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    no: {
        backgroundColor: 'white',
        borderColor: '#2196F3',
    },
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    TextYes: {
        color: 'white',
    },
    TextNo: {
        color: '#2196F3',
    },
});
