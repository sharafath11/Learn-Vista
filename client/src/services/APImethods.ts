import { userBlock } from "../types/adminTypes";
import { ILogin, IUserRegistration } from "../types/authTypes";
import { MentorSignupData } from "../types/mentorTypes";
import { getRequest, patchRequest, postRequest } from "./api";

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
  getSingleMentor: async (id: string) => await getRequest(`/admin/mentor/${id}`),
  blockUser: async (data: userBlock) => await patchRequest("/admin/users/block", { data }),
  mentorChangeStatus: async (mentorId: string, status: string, email: string) => await patchRequest("/admin/mentor/change-status", { mentorId, status, email }),
  blockMentor:async(mentorId:string,isBlock:boolean)=>await patchRequest("/admin/mentor/block",{mentorId,isBlock})
}
export const MentorAPIMenthods = {
  signup: async (mentorData: MentorSignupData) => await postRequest("/mentor/signup", mentorData),
  otpSend: async (email: string) => await postRequest("/mentor/send-otp", {email})
}