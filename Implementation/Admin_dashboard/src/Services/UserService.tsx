import axios from "../axiosConfigs";
import * as Axios from "axios";

export const getUsers = async () => {
    try{
        const res = await axios.get("users/getAll");
        return res.data;
    } catch (error) {
        if (Axios.isAxiosError(error)) {
            if (!error.response) {
                throw new Error("Unable to reach server. Please check your connection.");
            }
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
    
};

