// axiosInstance.ts
import axios from "axios";
import { showErrorToast, showInfoToast } from "../utils/Toast";

const baseURL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // send cookies
});

// Optional: you can store access token in memory if backend sends it as response
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
   showErrorToast(error.response.data.msg)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.get("/refresh-token");
          processQueue(null);
          //original reqst
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("abscddddvrgv")
        processQueue(refreshError, null);
        showInfoToast("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
