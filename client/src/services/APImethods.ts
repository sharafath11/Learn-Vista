import { ICourse, userBlock } from "../types/adminTypes";
import { ILogin, IUserRegistration } from "../types/authTypes";
import { MentorSignupData } from "../types/mentorTypes";
import { getRequest, patchRequest, postRequest } from "./api";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;

export const UserAPIMethods = {
  fetchUser: () => get('/user'),
  loginUser: (data: ILogin) => post("/login", data),
  sendOtp: (email: string) => post("/otp", { email }),
  signUp: (userData: IUserRegistration) => post("/signup", userData),
  otpVerify: (email: string, otp: string) => post("/otp-verify", { email, otp }),
  applyMentor: (data: FormData) => post("/apply-mentor", data),
  editProfile: (data: FormData) => post("/edit-profile", data),
  logout: () => post("/logout", {}),
  forgotPassword: (email: string) => post("/forgot-password", { email }),
  resetPassword: (token: string, password: string) => post("/reset-password", { token, password })
} as const;

export const AdminAPIMethods = {
  fetchUser: () => get("/admin/users"),
  fetchMentor: () => get("/admin/mentors"),
  getSingleMentor: (id: string) => get(`/admin/mentor/${id}`),
  blockUser: (data: userBlock) => patch("/admin/users/block", data),
  mentorChangeStatus: (mentorId: string, status: string, email: string) => 
  patch("/admin/mentor/change-status", { mentorId, status, email }),
  blockMentor: (mentorId: string, isBlock: boolean) => 
  patch("/admin/mentor/block", { mentorId, isBlock }),
  createCourse: (data: ICourse) => post("/admin/create-course", data),
  addCategory:(title:string,discription:string)=>post("/admin/add-categories",{title:title,discription:discription}),
  logout: () => post("/admin/logout", {})
} as const;

export const MentorAPIMethods = {
  signup: (mentorData: MentorSignupData) => post("/mentor/signup", mentorData),
  otpSend: (email: string) => post("/mentor/send-otp", { email }),
  login: (email: string, password: string) => post("/mentor/login", { email, password }),
  logout: () => post("/mentor/logout", {}),
  getMentor: () => get("/mentor/get-mentor"),
  editProfile: (data: FormData) => post("/mentor/edit-profile", data),
  forgotPassword: (email: string) => post("/mentor/forget-password", { email }),
  resetPassword: (token: string, password: string) => post("/mentor/reset-password", { token, password })
} as const;