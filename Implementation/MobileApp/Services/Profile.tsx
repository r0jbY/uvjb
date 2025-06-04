import axios from "@/app/axiosConfigs";
import { UserProfile } from "@/types/UserProfile";
import { handleAxiosError } from "@/utils/axiosErrorHandler";
import { AxiosError } from "axios";
import * as SecureStore from 'expo-secure-store';
import { checkAuth } from "./Authentication";

export const getProfileInfo = async (id: string): Promise<{ data: UserProfile }> => {

    try {
        const data = await axios.get(`/users/full/${id}`);
        return data;
    } catch (error: unknown) {
        handleAxiosError(error);
        throw new Error("Unreachable");
    }
};

export const updateProfileInfo = async (
  id: string,
  payload: Partial<UserProfile>
) => {
    console.log(payload);
  return axios.put(`/users/update/${id}`, payload);   
};