import axiosInstance from "./AxiosInstance";
import { showErrorToast, showInfoToast } from "../utils/Toast";

const handleErrorToast = (msg?: string) => {
 
  if (msg && msg.length > 1) {
    showErrorToast(msg); 
  }
};



export const postRequest = async (url: string, body: object | FormData) => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";

    const res = await axiosInstance.post(url, body, { headers });
    if (res.data.ok) return res.data;

    handleErrorToast(res.data.msg);
    return null;
  } catch (error: any) {
    console.log("POST error:", error);
    handleErrorToast(error?.response?.data?.msg);
    return null;
  }
};

export const getRequest = async (url: string, params?: object) => {
  try {
    const res = await axiosInstance.get(url, params ? { params } : {});
    if (res.data.ok) return res.data;

    handleErrorToast(res.data.msg);
    return null;
  } catch (error: any) {
    if (error.response?.status === 401) {
      showInfoToast("Please login again.");
    } else {
      handleErrorToast(error?.response?.data?.msg);
    }
    return null;
  }
};

export const patchRequest = async (url: string, body: object) => {
  try {
    const res = await axiosInstance.patch(url, body, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.ok) return res.data;

    handleErrorToast(res.data.msg);
    return null;
  } catch (error: any) {
    console.log("PATCH error:", error.response.data);
    handleErrorToast(error?.response?.data?.msg);
    return null;
  }
};
