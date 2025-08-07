import { IConcern } from "../../../../types/concernTypes";

export interface IMentorConcernService {
  addConcern(
    concern: Partial<IConcern>,
    files?: Express.Multer.File[]
  ): Promise<IConcern>;
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
