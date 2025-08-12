import { ObjectId } from "mongoose";
import { IGetAllCommentsResponse, PaginationMeta } from "../../../../types/lessons";
import { IMentorCommentResponseDto } from "../../../../shared/dtos/comment/commentResponse.dto";


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
  getAllComments(params: GetAllCommentsParams,):Promise <IGetAllCommentsResponse>
};

