import axios from "../axiosConfigs";

export const login = async (email: string, password: string) => {
    try{
        const res = await axios.post("auth/login", {email, password});
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error("Login Failed");
    }
};