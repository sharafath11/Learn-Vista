import { UserBlock } from "../../types/adminTypes";
import { getRequest, postRequest, patchRequest } from "../api";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
 
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
   getDonation: () => get("/admin/donations"),
   getFilteredDonations: (query: string) => get(`/admin/donations/filter?${query}`),
   getCertificate: (userId: string) => get(`/admin/user/certificates/${userId}`),
   revokedCertificate: (certificateId: string, isRevoked: boolean) => patch(`/admin/user/certificate/isRevocked`, { certificateId, isRevoked }),
   getLesson:(courseId:string)=>get(`/admin/course/lessons/${courseId}`)
 } as const;
 
