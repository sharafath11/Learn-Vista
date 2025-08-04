import { IQuestions } from "../../types/lessons";
import { IMentorSignupData } from "../../types/mentorTypes";
import { getRequest, postRequest, patchRequest } from "../api";


const get = getRequest;
const post = postRequest;
const patch = patchRequest;


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
}) =>  get("/mentor/pagenated/courses", { params }),

getAllComments: (params: {
  sortBy?: string
  search?: string
  courseId?: string
  page?: number
  limit?: number
}) => get("/mentor/comments", { params }),
publishCourse:(courseId:string,status:boolean)=>patch(`/mentor/publishCourse/${courseId}`,{status})

} as const;
