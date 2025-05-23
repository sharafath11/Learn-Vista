import {   UserBlock,  } from "../types/adminTypes";
import { ILogin, IUserRegistration } from "../types/authTypes";
import { ILessons } from "../types/lessons";
import { IMentorSignupData } from "../types/mentorTypes";

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
  resetPassword: (token: string, password: string) => post("/reset-password", { token, password }),
  changePassword:(password:string,newPassword:string)=>post("/change/password",{password,newPassword}),
  fetchAllCourse: (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Record<string, any>;
    sort?: Record<string, 1 | -1>
  }) => get(`/courses`,{params}),
  updateCourse: (courseId: string) => patch("/update-course", { courseId }),
  getUserRoomId:(courseId:string)=>get(`/start-live/vc/${courseId}`)
} as const;

export const AdminAPIMethods = {
  fetchUsers: (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Record<string, any>;
    sort?: Record<string, 1 | -1>;
  }) => get(`/admin/users`, { params }),
  fetchMentor: (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Record<string, any>;
    sort?: Record<string, 1 | -1>;
  }) => get("/admin/mentors",{params}),
  getSingleMentor: (id: string) => get(`/admin/mentor/${id}`),
  blockUser: (data: UserBlock) => patch("/admin/users/block", data),
  mentorChangeStatus: (mentorId: string, status: string, email: string) => 
  patch("/admin/mentor/change-status", { mentorId, status, email }),
  blockMentor: (mentorId: string, isBlock: boolean) => 
  patch("/admin/mentor/block", { mentorId, isBlock }),
  createCourse: (data: FormData) => post("/admin/create-course", data),
  getCourses: (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Record<string, any>;
    sort?: Record<string, 1 | -1>
  }) => get("/admin/courses",{params}),
  blockCours: (id: string, status: boolean) => patch("/admin/block-courses", { id: id, status: status }),
  editCourse:(data:FormData)=>patch("/admin/course/edit-course",data),
  addCategory: (title: string, discription: string) => post("/admin/add-categories", { title: title, discription: discription }),
  getGetegories: (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Record<string, any>;
    sort?: Record<string, 1 | -1>
  }) => get("/admin/categories",{params}),
  editCategory: (id: string, title: string, discription: string) =>
    patch(`/admin/edit/category`, { id, title, discription }),
    blockCategorie:(id:string,status:boolean)=>patch("/admin/categorie/block",{id,status}),
  logout: () => post("/admin/logout", {})
} as const;

export const MentorAPIMethods = {
  signup: (mentorData: IMentorSignupData) => post("/mentor/signup", mentorData),
  otpSend: (email: string) => post("/mentor/send-otp", { email }),
  login: (email: string, password: string) => post("/mentor/login", { email, password }),
  logout: () => post("/mentor/logout", {}),
  getMentor: () => get("/mentor/get-mentor"),
  editProfile: (data: FormData) => post("/mentor/edit-profile", data),
  forgotPassword: (email: string) => post("/mentor/forget-password", { email }),
  resetPassword: (token: string, password: string) => post("/mentor/reset-password", { token, password }),
  changePassword:(password:string,newPassword:string)=>post("/mentor/change/password",{password,newPassword}),
  getCourses: () => get("/mentor/courses"),
  courseStatusChange: (courseId: string, status: string, reson: string) => patch("/mentor/course/status-change", { courseId: courseId, status: status, courseRejectReson: reson }),
  startLiveSession: (courseId: string) => get(`/mentor/live-session/start/${courseId}`),
  endStream: (liveId: string) => get(`/mentor/end/stream/${liveId}`),
  getLessons: (courseId: string) => get(`/mentor/courses/lessons/${courseId}`),
  addLesson: (courseId: string, lesson: Partial<ILessons>) => post("mentor/add-lessons", { courseId, lesson }),
  updateLesson: (lessonId: string, updateLesson: Partial<ILessons>) => patch("/mentor/edit/lessons", {
    lessonId,
    updateLesson
  })
} as const;