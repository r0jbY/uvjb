import axios from "axios";

const axiosInstace = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true
});

export default axiosInstace;