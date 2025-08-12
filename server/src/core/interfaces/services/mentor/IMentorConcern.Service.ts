import { IConernMentorResponse } from "../../../../shared/dtos/concern/concern-response.dto";
import { IConcern } from "../../../../types/concernTypes";

export interface IMentorConcernService {
  addConcern(
    concern: Partial<IConcern>,
    files?: Express.Multer.File[]
  ): Promise<IConernMentorResponse>;
 getConcerns(
  filters: Record<string, any>,
  sort: Record<string, 1 | -1>,
  skip: number,
  limit: number
): Promise<{
  data: IConernMentorResponse[];
  total: number;
}>;

}
