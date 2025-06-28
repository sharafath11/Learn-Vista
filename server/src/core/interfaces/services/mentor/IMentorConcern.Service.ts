import { IAttachment, IConcern } from "../../../../types/concernTypes";

export interface IMentorConcernService {
    addConcern(data:Partial<IConcern>):Promise<IConcern>
}