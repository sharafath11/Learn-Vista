import axios, { AxiosError, AxiosResponse } from "axios";
import { showErrorToast, showInfoToast, showSuccessToast } from "../utils/Toast";
const baseURL = "http://localhost:4000"

export const postRequest = async (url: string, body: object | FormData) => {
  try {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.post(`${baseURL}${url}`, body, { headers });

    if (res.data.ok) {
      return res.data;
    }

    showErrorToast(res.data.msg || "Something went wrong!");
    return null;
  } catch (error: any) {
    showErrorToast(error?.response?.data?.msg || "Server error, try again!");
    return null;
  }
}
