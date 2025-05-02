import axiosInstance from "./AxiosInstance";
import { showErrorToast, showInfoToast } from "../utils/Toast";

type ApiOptions = {
  showToast?: boolean;
};

const defaultOptions: ApiOptions = {
  showToast: true,
};

const handleApiError = (error: any, options: ApiOptions) => {
  console.error("API Error:", error);
  
  if (!options.showToast) return;

  const message = error?.response?.data?.msg || error.message || "Request failed";
  
  if (error.response?.status === 401) {
    showInfoToast("Please login again.");
  } else {
    showErrorToast(message);
  }
};

export const postRequest = async <T = any>(
  url: string,
  body: object | FormData,
  options: ApiOptions = defaultOptions
): Promise<T | null> => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    console.log("dfgdfgdfgdfg",body)
    const res = await axiosInstance.post(url, body, { headers });
    
    if (!res.data.ok) {
      throw new Error(res.data.msg || 'Request failed');
    }
    
    return res.data;
  } catch (error: any) {
    handleApiError(error, options);
    return null;
  }
};

export const getRequest = async <T = any>(
  url: string,
  params?: object,
  options: ApiOptions = defaultOptions
): Promise<T | null> => {
  try {
    const res = await axiosInstance.get(url, params ? { params } : {});
    
    if (!res.data.ok) {
      throw new Error(res.data.msg || 'Request failed');
    }
    
    return res.data;
  } catch (error: any) {
    handleApiError(error, options);
    return null;
  }
};

export const patchRequest = async <T = any>(
  url: string,
  body: object,
  options: ApiOptions = defaultOptions
): Promise<T | null> => {
  try {
    const res = await axiosInstance.patch(url, body, {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.data.ok) {
      throw new Error(res.data.msg || 'Request failed');
    }
    
    return res.data;
  } catch (error: any) {
    handleApiError(error, options);
    return null;
  }
};