import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import HistoryCard from './components/HistoryCard';
import { getItem } from '../persiststorage/AsyncStorage';

const dataSet = [
    {
        id: "1a",
        name: "Ming",
        address: "Plaats, straat en huisnummer",
        tel: "0031 06 28957718",
        telSB: "0031 06 28957718",
        accepted: "2024-05-20T15:35:32.284Z",
        note: "In het bos gewandeld voor 2 uur"
    },
    {
        id: "2a",
        name: "Ming",
        address: "Plaats, straat en huisnummer",
        tel: "0031 06 28957718",
        telSB: "0031 06 28957718",
        accepted: "2024-05-21T12:04:48.859Z",
        note: "Naar een café geweest"
    },
    {
        id: "3a",
        name: "Ming",
        address: "Plaats, straat en huisnummer",
        tel: "0031 06 28957718",
        telSB: "0031 06 28957718",
        accepted: "2024-05-21T12:04:48.859Z",
        note: "Naar een café geweest"
    },
    {
        id: "4a",
        name: "Ming",
        address: "Plaats, straat en huisnummer",
        tel: "0031 06 28957718",
        telSB: "0031 06 28957718",
        accepted: "2024-05-21T12:04:48.859Z",
        note: "Naar een café geweest"
    },
]

export default function History() {
    const [data, setData] = useState([]);
    const [token, setToken] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        async function getToken() {
            const jwt = await getItem("jwt");
            setToken(jwt);
        }
        getToken();
        fetchData(token);
    }, []);

    const fetchData = (jwt) => {
        setData(dataSet);
        setRefreshing(false);
    };
    const onRefresh = () => {
        setRefreshing(true);
        fetchData(); // Fetch data again when pull-to-refresh is triggered
    };
    return (
        <SafeAreaView>
            <FlatList
                data={data}
                renderItem={({ item }) => <HistoryCard cardInfo={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 10,
    },
    row: {
        justifyContent: 'space-around',
        marginBottom: 10,
    },
});