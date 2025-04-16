import { ILogin, IUserRegistration, MentorApplyFormData } from "../types/authTypes";
import { getRequest, postRequest } from "./api";

export const UserAPIMethods = {
  fetchUser: async () => await getRequest('/user'),
  loginUser: async (data: ILogin) => await postRequest("/login", data),
  sendOtp: async (email: string) => await postRequest("/otp", { email: email }),
  signUp: async (userData: IUserRegistration) => await postRequest("/signup", userData),
  applyMentor:async(data:FormData)=>await postRequest("/apply-mentor",data)
}

export const AdminAPIMethods = {
  fetchUser: async () => await getRequest("/admin/users"),
  fetchMentor: async () => await getRequest("/admin/mentors"),
}