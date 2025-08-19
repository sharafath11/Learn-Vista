import { IQuestions } from "../../types/lessons";
import { IMentorSignupData } from "../../types/mentorTypes";
import { getRequest, postRequest, patchRequest } from "../api";


const get = getRequest;
const post = postRequest;
const patch = patchRequest;


export const MentorAPIMethods = {
  signup: (mentorData: IMentorSignupData) => post("/mentor/auth/signup", mentorData),
  otpSend: (email: string) => post("/mentor/auth/signup/otp", { email }),
  login: (email: string, password: string) => post("/mentor/auth/login", { email, password }),
  logout: () => post("/mentor/auth/logout", {}),
  getMentor: () => get("/mentor/me"),
  editProfile: (data: FormData) => patch("/mentor/profile", data),
  forgotPassword: (email: string) => post("/mentor/auth/password/forgot", { email }),
  resetPassword: (token: string, password: string) => post("/mentor/auth/password/reset", { token, password }),
  changePassword:(password:string,newPassword:string)=>post("/mentor/me/password",{password,newPassword}),
  getCourses: () => get("/mentor/courses"),
  courseStatusChange: (courseId: string, status: string, reson: string) => patch(`/mentor/courses/${courseId}/status`, {status: status, courseRejectReson: reson }),
  startLiveSession: (courseId: string) => get(`/mentor/courses/${courseId}/stream/start`),
  endStream: (liveId: string) => get(`/mentor/stream/${liveId}/end`),
  getLessons: (courseId: string) => get(`/mentor/courses/${courseId}/lessons`),
  addLesson: (lesson:FormData) => post("/mentor/lessons", lesson),
  updateLesson: (lessonId: string, updateLesson: FormData) => patch(`/mentor/lessons/${lessonId}`,updateLesson),
  getS3DirectUploadUrl: (fileName: string, fileType: string) => post("/mentor/lessons/upload-url", { fileName, fileType }),
  deleteS3file: (fileUrl: string) => post("/mentor/delete-s3-file", { fileUrl }),
  // uploadFileToS3:(uploadURL: string, file: File)=>post("mentor/uploadfiles-to-s3",{uploadURL}),
  getCommentsByLessonId:(lessonId:string)=>get(`/mentor/lessons/${lessonId}/comments`),
  getSignedVideoUrl: (lessonId: string, videoUrl: string) => post(`/mentor/lessons/${lessonId}/video-url`, {videoUrl }),
  addQustion: (data:Omit<IQuestions, "id" | "isCompleted">) => post("/mentor/lessons/question", data),
  getQustion: (lessonId: string) => get(`/mentor/lessons/${lessonId}/questions`),
  editQustion: (questionId: string, data: Omit<IQuestions, "id" | "isCompleted">) => patch(`/mentor/questions/${questionId}`, data),
  getCourseStudents: (params: {
  courseId: string;
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, any>;
    sort?: Record<string, 1 | -1>;
}) => {
  const { courseId, filters, sort, ...rest } = params;
  return get(`/mentor/course/${courseId}/students`, {
    params: {
      ...rest,
      filters: JSON.stringify(filters || {}),
      sort: JSON.stringify(sort || {}),
    },
  });
   
   
  },
 
  blockStudentInCourse: (courseId: string, studentId: string, status: boolean) => patch(`/mentor/students/${studentId}/block`, { courseId,status }),
  generateOptions: (question: string) => post("/mentor/lessons/options", { question }),
  riseConcern: (data: FormData) => post("/mentor/concerns", data),
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
}) =>  get("/mentor/courses/pagenated", { params }),

getAllComments: (params: {
  sortBy?: string
  search?: string
  courseId?: string
  page?: number
  limit?: number
}) => get("/mentor/comments", { params }),
publishCourse:(courseId:string,status:boolean)=>patch(`/mentor/courses/${courseId}/publish`,{status})

} as const;
