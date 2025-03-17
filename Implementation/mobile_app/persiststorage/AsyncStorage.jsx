import AsyncStorage from '@react-native-async-storage/async-storage';

const storeItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error(`Error storing ${key}: ${error}`);
    }
};

const getItem = async (key) => {
    try {
        const token = await AsyncStorage.getItem(key);
        return token;
    } catch (error) {
        console.error(`Error getting ${key}: ${error}`);
        return null;
    }
};

const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key}: ${error}`);
    }
};

export { storeItem, getItem, removeItem };
