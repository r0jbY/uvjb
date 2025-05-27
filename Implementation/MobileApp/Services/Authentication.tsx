import axios from "@/app/axiosConfigs";
import { handleAxiosError } from "@/utils/axiosErrorHandler";
import * as SecureStore from 'expo-secure-store';

export const login = async (email: string, password: string) => {

    try {
        const { data } = await axios.post('/auth/login', { email, password });

        axios.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        await SecureStore.setItemAsync('refreshToken', data.refreshToken);
        console.log(axios.defaults.headers.common.Authorization);
        console.log(SecureStore.getItem('refreshToken'));
        return data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};

export const checkAuth = async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) return { isAuthenticated: false, userId: null, role: null };

   return {
      isAuthenticated: true,
      userId: 1,
      role: "admin",
    };

//   try {
//     const { data } = await axios.post('/auth/refresh', { refreshToken });

//     // Save access token in memory
//     axios.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

//     return {
//       isAuthenticated: true,
//       userId: data.userId,
//       role: data.role,
//     };
//   } catch {
//     await SecureStore.deleteItemAsync('refreshToken');
//     return { isAuthenticated: false, userId: null, role: null };
//   }
};