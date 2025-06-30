import { IAttachment, IConcern } from "../../../../types/concernTypes";

export interface IMentorConcernService {
    addConcern(data: Partial<IConcern>): Promise<IConcern>
   getConcerns(
  filters: Record<string, any>,
  sort: Record<string, 1 | -1>,
  skip: number,
  limit: number
): Promise<{
  data: IConcern[];
  total: number;
}>;

}