import axios from "axios";

const axiosInstace = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://api.uurtjevoorjebuurtje.com/',
    withCredentials: true
});


export default axiosInstace;