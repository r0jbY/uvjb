import axios from "axios";

const axiosInstace = axios.create({
    baseURL: 'http://192.168.0.109:8080/',
    timeout: 7000,
});


export default axiosInstace;