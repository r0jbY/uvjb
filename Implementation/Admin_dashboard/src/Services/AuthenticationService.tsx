import axios from "../axiosConfigs";
import * as Axios from "axios";
import { handleAxiosError } from "../utils/axiosErrorHandler";

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post("/auth/login", { email, password });
    return res.data;
  } catch (error) {
    handleAxiosError(error);
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
    } catch (error){
        console.log(error);
    }
    return {userId, role, isAuthenticated};
};

export const logout = async () => {
    try{
        const res = await axios.post("/auth/logout", {withCredentials: true});

        console.log(res);
        return ("Logout worked!");
    } catch(error) {
        handleAxiosError(error);
    }
}