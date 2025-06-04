// ──────────────────────────────────────────────────────────────
// lib/axiosInstace.ts            (rename if you like)
// ──────────────────────────────────────────────────────────────
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { checkAuth } from '../Services/Authentication'

/* ------------------------------------------------------------- */
/* 1. Create the instance                                        */
/* ------------------------------------------------------------- */
const axiosInstace = axios.create({
  baseURL: 'http://192.168.8.132:8080/',
  timeout: 7000,
  headers: {
    'X-Client-Type': 'mobile',   // 👈 tell backend it's a mobile client
  },
});

/* ------------------------------------------------------------- */
/* 2.  Add "_retry" flag to AxiosRequestConfig for TS            */
/* ------------------------------------------------------------- */
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean; 
  }
}

/* ------------------------------------------------------------- */
/* 3.  Attach ONE response interceptor                           */
/* ------------------------------------------------------------- */
axiosInstace.interceptors.response.use(
  res => res,
  async (err) => {
    const original = err.config as AxiosRequestConfig;

    /* ⬇︎ Ignore if this request opted-out */
    if (original.skipAuthRefresh) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      const auth = await checkAuth(); // ← will set skipAuthRefresh=true
      if (auth.isAuthenticated) {
        return axiosInstace(original);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstace;
