import axios from "axios";

const axiosInstace = axios.create({
    baseURL: 'http://192.168.0.109:8080/',
    timeout: 7000,
    headers: {
    'X-Client-Type': 'mobile', // 👈 custom header for backend to detect mobile
  },
});


export default axiosInstace;