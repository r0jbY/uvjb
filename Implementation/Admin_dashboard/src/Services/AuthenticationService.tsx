import axios from "../axiosConfigs";
import * as Axios from "axios";

export const login = async (email: string, password: string) => {
    try{
        const res = await axios.post("auth/login", {email, password});
        return res.data;
    } catch (error) {
        if (Axios.isAxiosError(error)) {
            if (!error.response) {
                throw new Error("Unable to reach server. Please check your connection.");
            }
            throw new Error("Login failed");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
    
};