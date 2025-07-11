import { ObjectId } from "mongoose";


export interface GetAllCommentsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
    courseId?: string;
    mentorId:string |ObjectId
   
}

export interface IMentorCommentsService {
  getAllComments(params: GetAllCommentsParams,): Promise<any>;
}
