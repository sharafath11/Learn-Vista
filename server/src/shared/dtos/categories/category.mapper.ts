import { ICategory } from "../../../types/classTypes";
import { ICategoryResponseDto } from "./category-response.dto";

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
}