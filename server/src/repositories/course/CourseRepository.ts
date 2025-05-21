import { inject, injectable } from 'inversify';
import { BaseRepository } from '../BaseRepository';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { ICategory, ICourse, IPopulatedCourse } from '../../types/classTypes';
import CourseModel from '../../models/class/courseModel';
import { IMentor } from '../../types/mentorTypes';
import { IAdminCategoriesRepostory } from '../../core/interfaces/repositories/admin/IAdminCategoryRepository';
import { TYPES } from '../../core/types';

interface CourseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: {
    category?: string;
  };
  sort?: {
    [key: string]: 1 | -1;
  };
}

@injectable()
export class CourseRepository extends BaseRepository<ICourse, ICourse> implements ICourseRepository {
  constructor(
    @inject(TYPES.AdminCategoriesRepository) private _catRepo: IAdminCategoriesRepostory
  ) {
    super(CourseModel);
  }
  
  async findWithMenorIdgetAllWithPopulatedFields(id:string): Promise<IPopulatedCourse[]> {
    const courses = await CourseModel.find({mentorId:id})
      .populate('mentorId')
      .populate('categoryId')
      .lean();
    
    const populatedCourses: IPopulatedCourse[] = courses.map(course => ({
      ...course,
      mentorId: course.mentorId as unknown as IMentor,
      categoryId: course.categoryId as unknown as ICategory,
    }));
    
    return populatedCourses;
  }
  async populateWithAllFildes(): Promise<IPopulatedCourse[]> {
    const courses = await CourseModel.find()
      .populate('mentorId')
      .populate('categoryId')
      .lean();
    
    const populatedCourses: IPopulatedCourse[] = courses.map(course => ({
      ...course,
      mentorId: course.mentorId as unknown as IMentor,
      categoryId: course.categoryId as unknown as ICategory,
    }));
    
    return populatedCourses;
  }
  async fetchAllCoursesWithFilters(params: CourseQueryParams): Promise<{ data: IPopulatedCourse[]; total: number; totalPages: number }> {
    const { page = 1, limit = 1, search, filters, sort } = params;
    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (filters?.category && filters.category !== 'All') {
      const categoryDoc = await this._catRepo.findOne({ title: filters.category });
      if (categoryDoc) {
        query.categoryId = categoryDoc._id;
      } else {

        return { data: [], total: 0, totalPages: 0 };
      }
    }
    const total = await CourseModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    let courseQuery = CourseModel.find(query)
      .populate('mentorId')
      .populate('categoryId');
    if (sort && Object.keys(sort).length > 0) {
      courseQuery = courseQuery.sort(sort);
    } else {
      courseQuery = courseQuery.sort({ createdAt: -1 }); 
    }
    const skip = (page - 1) * limit;
    courseQuery = courseQuery.skip(skip).limit(limit);

    const courses = await courseQuery.lean();

    const populatedCourses: IPopulatedCourse[] = courses.map(course => ({
      ...course,
      mentorId: course.mentorId as unknown as IMentor,
      categoryId: course.categoryId as unknown as ICategory,
    }));

    return { data: populatedCourses, total, totalPages }; 
  }
}
