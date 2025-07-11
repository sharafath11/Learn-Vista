import axios from "axios";
import {   UserBlock,  } from "../types/adminTypes";
import { ILogin, IUserRegistration } from "../types/authTypes";
import { AnswerWithType,  IQuestions } from "../types/lessons";
import { IMentorSignupData } from "../types/mentorTypes";

import { getRequest, patchRequest, postRequest } from "./api";
import { baseURL } from "./AxiosInstance";
import { INotificationPayload } from "../types/notificationsTypes";


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
  changePassword: (password: string, newPassword: string) => post("/change/password", { password, newPassword }),
  getCategories:()=>get("/categories"),
  fetchAllCourse: (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Record<string, any>;
    sort?: Record<string, 1 | -1>
  }) => get(`/courses`,{params}),
  updateCourse: (courseId: string) => patch("/update-course", { courseId }),
  getUserRoomId: (courseId: string) => get(`/start-live/vc/${courseId}`),
  getLessons: (courseId: string) => get(`/courses/lessons/${courseId}`),
  getQustion: (lessonId: string) => get(`/lesson/questions/${lessonId}`),
  getLessonDetils: (lessonId: string) => post("/lessonDetils", { lessonId }),
  getReport: (lessonId: string, data: AnswerWithType[]) => post("/lesson/report", { lessonId, data }),
  saveComment: (lessonId: string, comment: string) => post("/lesson/comment", { lessonId, comment }),
  createCheckoutSession: (amount: number, currency: string) => post("/create-checkout-session", { amount, currency }),
  getStripeCheckoutSession: (sessionId: string) => get(`/stripe/verify-session/${sessionId}`),
  getUserProgress: () => get("/course/progress"),
  psc: (number: number) => get(`/let-fun/psc`, {number}),
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
  }) => get("/admin/mentors", { params }),
  getAllMentor:()=>get("/admin/all/mentors"),
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
  }) => get("/admin/categories", { params }),
  getAllCategories:()=>get("/admin/all/categegory"),
  editCategory: (id: string, title: string, discription: string) =>
    patch(`/admin/edit/category`, { id, title, discription }),
    blockCategorie:(id:string,status:boolean)=>patch("/admin/categorie/block",{id,status}),
  logout: () => post("/admin/logout", {}),
  getConcern: () => get("/admin/concers"),
   getAllConcernsWithpagenation: (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Record<string, any>;
    sort?: Record<string, 1 | -1>;
  }) => get("/admin/all/concerns", { params }),
   updateConcernStatus: (concernId: string, status: "resolved" | "in-progress", resolution: string) => 
    patch(`/admin/concern/${concernId}/status`, { status, resolution }),
   getDonation:()=>get("/admin/donations")
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
  addLesson: (lesson:FormData) => post("/mentor/add-lessons", lesson),
  updateLesson: (lessonId: string, updateLesson: FormData) => patch(`/mentor/edit/lessons/${lessonId}`,updateLesson),
  getS3DirectUploadUrl: (fileName: string, fileType: string) => post("/mentor/generate-s3-upload-url", { fileName, fileType }),
  deleteS3file: (fileUrl: string) => post("/mentor/delete-s3-file", { fileUrl }),
  // uploadFileToS3:(uploadURL: string, file: File)=>post("mentor/uploadfiles-to-s3",{uploadURL}),
  getCommentsByLessonId:(lessonId:string)=>get(`/mentor/comments/${lessonId}`),
  getSignedVideoUrl: (lessonId: string, videoUrl: string) => post(`/mentor/play-video`, { lessonId, videoUrl }),
  addQustion: (data:Omit<IQuestions, "id" | "isCompleted">) => post("/mentor/lessons/add/questions", data),
  getQustion: (lessonId: string) => get(`/mentor/lesson/questions/${lessonId}`),
  editQustion: (qustionId: string, data: Omit<IQuestions, "id" | "isCompleted">) => patch(`/mentor/lesson/edit/question/${qustionId}`, data),
 getCourseStudents: (params: {
  courseId: string;
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
}) => {
  const { courseId, filters, sort, ...rest } = params;
  return get(`/mentor/course/students/${courseId}`, {
    params: {
      ...rest,
      filters: JSON.stringify(filters || {}),
      sort: JSON.stringify(sort || {}),
    },
  });
   
   
  },
 
  blockStudentInCourse: (courseId: string, userId: string, status: boolean) => patch("/mentor/student/block", { courseId, userId, status }),
  generateOptions: (question: string) => post("/mentor/genarate/options", { question }),
  riseConcern: (data: FormData) => post("/mentor/raise/concern", data),
 getConcern: (params: {
  search?: string
  status?: string
  courseId?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  pageSize?: number
}) => get("/mentor/concerns", {
  params: {
    ...params
  }
}),
getCourseWithFilter: (params: {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
}) =>  get("/mentor/pagenated/courses", { params })




} as const;

export const batmanAi = {
  askDoubt: async (input: string) => {
    const response = await axios.post(`${baseURL}/ai/doubt`, { text: input });
    return response.data;
  },
};
export const NotificationAPIMethods = {
  getMyNotifications: () => get("/shared/notifications"),
  markAsRead: (id: string) => patch(`/shared/notifications/${id}/read`, {}),
  markAllAsRead: () => patch("/shared/notifications/mark-all-read", {}),
  createNotification: (data: INotificationPayload) => post("/shared/notifications", data),
};

