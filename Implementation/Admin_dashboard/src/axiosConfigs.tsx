import axios from "axios";

const axiosInstace = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/',
    withCredentials: true
});


export default axiosInstace;