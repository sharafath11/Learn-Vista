import { ICategory} from "../../../../types/classTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface IAdminCategoriesRepostory extends  IBaseRepository <ICategory,ICategory> {
  
}