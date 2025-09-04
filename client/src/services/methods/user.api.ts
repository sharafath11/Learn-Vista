import { IFetchAllCourseParams } from "@/src/types/courseTypes";
import { ILogin, IUserRegistration } from "../../types/authTypes";
import { AnswerWithType, ILessonProgressUpdate } from "../../types/lessons";
import { getRequest, postRequest, patchRequest } from "../api";

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
  editProfile: (data: FormData) => patch("/profile", data),
  logout: () => post("/logout", {}),
  forgotPassword: (email: string) => post("/forgot-password", { email }),
  resetPassword: (token: string, password: string) => post("/reset-password", { token, password }),
  changePassword: (password: string, newPassword: string) => patch("/profile/password", { password, newPassword }),
  getCategories:()=>get("/categories"),
  fetchAllCourse: (params:IFetchAllCourseParams) => get(`/courses`,{params}),
  updateCourse: (courseId: string) => patch(`/courses/${courseId}`,{}),
  getUserRoomId: (courseId: string) => get(`/start-live/vc/${courseId}`),
  checkValidUser:(liveId:string)=>get(`/live/${liveId}/verify`),
  getLessons: (courseId: string) => get(`/courses/lessons/${courseId}`),
  getQustion: (lessonId: string) => get(`/lessons/${lessonId}/questions`),
  getLessonDetils: (lessonId: string) => get(`/lessons/${lessonId}/details`),
  getReport: (lessonId: string, data: AnswerWithType[]) => post(`/lessons/${lessonId}/report`, {data }),
  saveComment: (lessonId: string, comment: string) => post(`/lessons/${lessonId}/comment`, {comment }),
  createCheckoutSession: (amount: number, currency: string) => post("/donations/checkout-session", { amount, currency }),
  getStripeCheckoutSession: (sessionId: string) => get(`/donation-session/${sessionId}/verify`),
  getUserProgress: () => get("/course/progress"),
  psc: (number: number) => get(`/let-fun/psc`, { number }),
 updateLessonProgress: (
  lessonId: string,
  update: ILessonProgressUpdate 
  ) => patch(`/lessons/${lessonId}/progress`, {...update }),
  getMyDonations: (limit: number) => get(`/donations/${limit}`),
 getCertificates: (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: Record<string, 1 | -1>;
  filters?: {
    courseTitle?: string;
    isRevoked?: boolean;
  };
}) => get("/certificates", { params }),
  getCertificate: (certificateId: string) => get(`/certificate/${certificateId}`),
  getDailyTask: () => get("/daily-task/today"),
 submitDailyTaskAnswer: (formData:FormData) =>post("/daily-task/today",formData),
  getAllDailyTask: () => get("/dailyTaks"),
  voiceNote: (lessonId: string, courseId: string, note: string) =>
    post(`/lessons/${lessonId}/voicenote`, { note, courseId }),
  
  
 getVoiceNotes: (
    lessonId: string,
    params?: { search?: string; sort?: "asc" | "desc" }
  ) => get(`/lessons/${lessonId}/voicenotes`, { params }),

} as const;