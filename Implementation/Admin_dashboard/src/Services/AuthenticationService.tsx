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

export const checkAuth = async () => {
    let userId = null;
    let isAuthenticated = false;
    let role = null;
    try {
        const res =await axios.get("/auth/whoAmI", {withCredentials: true});
        userId = res.data.id;
        role = res.data.role;
        isAuthenticated = true;
        console.log(`${userId} ${role} is logged in right now!`)
    } catch (error){
        console.log(error);
    }
    return {userId, role, isAuthenticated};
};