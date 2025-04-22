import axiosInstance from "./AxiosInstance";
import { showErrorToast, showInfoToast } from "../utils/Toast";

export const postRequest = async (url: string, body: object | FormData) => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";

    const res = await axiosInstance.post(url, body, { headers });
    if (res.data.ok) return res.data;
    
    console.log(res)
    showErrorToast(res.data.msg || "Something went wrong!");
    return null;
  } catch (error: any) {
    showErrorToast(error?.response?.data?.msg || "Server error, try again!");
    return null;
  }
};

export const getRequest = async (url: string, params?: object) => {
  try {
    const res = await axiosInstance.get(url, params ? { params } : {});
    if (res.data.ok)   return res.data;
    

    showErrorToast(res.data.msg || "Something went wrong!");
    return null;
  } catch (error: any) {
    if (error.response?.status === 401) {
      showInfoToast("Please login again.");
    } else {
      showErrorToast(error?.response?.data?.msg || "Server error, try again!");
    }
    return null;
  }
};

export const patchRequest = async (url: string, body: object) => {
  try {
    const res = await axiosInstance.patch(url, body, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.ok) {
      if (res.data.msg.includes("Logged out successfully")) {
        window.location.reload()
      }
      
        return res.data;
    }

    showErrorToast(res.data.msg || "Something went wrong!");
    return null;
  } catch (error: any) {
    showErrorToast(error?.response?.data?.msg || "Server error, try again!");
    return null;
  }
};
