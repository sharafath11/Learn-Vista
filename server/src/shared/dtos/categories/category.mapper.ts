import { ICategory } from "../../../types/classTypes";
import { ICategoryCoursePopulated, ICategoryResponseDto } from "./category-response.dto";

export class CategoryMapper {
  static toResponseDto(category: ICategory): ICategoryResponseDto {
    return {
      id: category._id.toString(),
      title: category.title,
      description: category.description,
      isBlock:category.isBlock,
      createdAt: category.createdAt
    };
  }
  static toResponsePopulatedAdminCourse(category: ICategory):ICategoryCoursePopulated {
    return {
      id: category.id,
      title: category.title,
      
    }
  }
}