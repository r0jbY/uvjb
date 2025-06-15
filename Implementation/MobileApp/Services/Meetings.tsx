import axios from "@/app/axiosConfigs";
import { UserProfile } from "@/types/UserProfile";
import { handleAxiosError } from "@/utils/axiosErrorHandler";
import { AxiosError } from "axios";
import * as SecureStore from 'expo-secure-store';
import { checkAuth } from "./Authentication";

export const getMeetings = async (id: string) => {
    try {
        const res = await axios.get(`/meetings/${id}`);
        console.log(res.data);
        return res.data;
    } catch (error: unknown) {
        console.log(error);
        handleAxiosError(error);
    }
};

export const acceptMeeting = async (meetingId: string, buddyId: string) => {
    try {
        const res = await axios.put(`/meetings/accept/${meetingId}`, {buddyId});
        console.log(res.data);
        console.log('Accepted!');
        return res.data;
    } catch (error: unknown) {
        console.log(error);
        handleAxiosError(error);
    } 
};

export const getMeetingHistory = async (buddyId: string) => {
    try {
        const res = await axios.get(`/meetings/history/${buddyId}`);
        console.log(res.data);
        console.log('Got history!');
        return res.data;
    } catch (error: unknown) {
        console.log(error);
        handleAxiosError(error);
    } 
}

export const finishMeeting = async (meetingId: string, buddyId: string, description: string) => {
    try {
        const res = await axios.put(`/meetings/finish/${meetingId}`, {buddyId, description});
        console.log(res.data);
        console.log('Finished!');
        return res.data;
    } catch (error: unknown) {
        console.log(error);
        handleAxiosError(error);
    } 
};
 
export async function getCurrentActiveMeeting(userId: string) {
    console.log('Here!');
    console.log(userId);  
  const res = await axios.get(`/meetings/current-accepted/${userId}`);
  console.log(res.data);
  return res.data; // assumes: { id, name, phone, address, createdAt }
} 
