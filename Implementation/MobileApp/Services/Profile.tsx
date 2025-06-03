import axios from "@/app/axiosConfigs";
import { UserProfile } from "@/types/UserProfile";
import { handleAxiosError } from "@/utils/axiosErrorHandler";
import * as SecureStore from 'expo-secure-store';

export const getProfileInfo = async (id: string): Promise<{ data: UserProfile }> => {

    try {
        console.log("Hello!");
        const  data  = await axios.get(`/users/full/${id}`);
        
        return data;
    } catch (error: unknown) {
        handleAxiosError(error);
        throw new Error("Unreachable");
    }
};