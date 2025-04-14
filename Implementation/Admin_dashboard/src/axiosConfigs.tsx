import axios from "axios";

const axiosInstace = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true
});

export default axiosInstace;