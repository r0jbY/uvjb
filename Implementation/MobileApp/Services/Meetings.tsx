import axios from "@/app/axiosConfigs";
import { UserProfile } from "@/types/UserProfile";
import { handleAxiosError } from "@/utils/axiosErrorHandler";
import { AxiosError } from "axios";
import * as SecureStore from 'expo-secure-store';
import { checkAuth } from "./Authentication";

export const getMeetings = async (id: string) => {
    try {
        const res = await axios.get(`/meetings/${id}`);
        return res.data;
    } catch (error: unknown) {
        console.log(error);
        handleAxiosError(error);
    }
};
