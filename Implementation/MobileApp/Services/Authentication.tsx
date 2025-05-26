import axios from "@/app/axiosConfigs";
import { handleAxiosError } from "@/utils/axiosErrorHandler";
import * as SecureStore from 'expo-secure-store';

export const login = async (email: string, password: string) => {

    
    try {
        const { data } = await axios.post('/auth/login', { email, password });
        console.log(data);
        
    } catch (error: unknown) {
        handleAxiosError(error);

    }


    //   axios.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
    //   await SecureStore.setItemAsync('refreshToken', data.refreshToken);
};