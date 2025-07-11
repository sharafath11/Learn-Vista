import axios from "axios";
import { showInfoToast } from "../utils/Toast";
import { useLoading } from "../hooks/useLoading";

export const baseURL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Loading state management
let activeRequests = 0;
const { start, stop } = useLoading.getState();

axiosInstance.interceptors.request.use(config => {
  if (activeRequests === 0) start();
  activeRequests++;
  return config;
});

const handleResponseCompletion = () => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    stop();
  }
};

// Token refresh handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(null);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    handleResponseCompletion();
    return response;
  },
  async (error) => {
    handleResponseCompletion();
    const originalRequest = error.config;

    // Only handle 401 errors here
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.get("/refresh-token");
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        showInfoToast("Session expired. Please login again.");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;