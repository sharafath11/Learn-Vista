import { inject, injectable } from 'inversify';
import { BaseRepository } from '../BaseRepository';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { ICategory, ICourse, IPopulatedCourse } from '../../types/classTypes';
import CourseModel from '../../models/class/courseModel';
import { IMentor } from '../../types/mentorTypes';
import { IAdminCategoriesRepostory } from '../../core/interfaces/repositories/admin/IAdminCategoryRepository';
import { TYPES } from '../../core/types';
import { ObjectId } from 'mongoose';
import { ICategoriesRepository } from '../../core/interfaces/repositories/course/ICategoriesRepository';

interface CourseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: {
    categoryId?: string;
  };
  sort?: {
    [key: string]: 1 | -1;
  };
}

@injectable()
export class CourseRepository extends BaseRepository<ICourse, ICourse> implements ICourseRepository {
  constructor(
    @inject(TYPES.CategoriesRepository) private _catRepo: ICategoriesRepository
  ) {
    super(CourseModel);
  }
  
  async findWithMenorIdgetAllWithPopulatedFields(id:string|ObjectId): Promise<IPopulatedCourse[]> {
    const courses = await CourseModel.find({mentorId:id})
      .populate('mentorId')
      .populate('categoryId')
      .lean();
    
    const populatedCourses: IPopulatedCourse[] = courses.map(course => ({
      ...course,
      mentorId: course.mentorId as unknown as IMentor,
      categoryId: course.categoryId as unknown as ICategory,
    }));
    //validation removed filter .is blocked and verifyed like tr
    return populatedCourses ;
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
  async fetchAllCoursesWithFilters(params: CourseQueryParams): Promise<{
    data: IPopulatedCourse[];
    total: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, search, filters, sort } = params;
    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    console.log(filters?.categoryId)
    if (filters?.categoryId && filters.categoryId !== 'All') {
      console.log("abcd");
      
      const categoryDoc = await this._catRepo.findById(filters.categoryId);
     
      
      if (categoryDoc) {
        query.categoryId = categoryDoc.id;
      } else {
        return { data: [], total: 0, totalPages: 0 };
      }
    }
    let courseQuery = CourseModel.find(query)
      .populate('mentorId')
      .populate('categoryId');
    if (sort && Object.keys(sort).length > 0) {
      courseQuery = courseQuery.sort(sort);
    } else {
      courseQuery = courseQuery.sort({ createdAt: -1 }); 
    }

    const allCourses = await courseQuery.lean();
  
   
    const filteredCourses: IPopulatedCourse[] = allCourses
      .map((course) => ({
        ...course,
        mentorId: course.mentorId as unknown as IMentor,
        categoryId: course.categoryId as unknown as ICategory,
      }))
      .filter((course) => !course.isBlock && !course.categoryId.isBlock &&course.mentorStatus=="approved");
  
    const total = filteredCourses.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
  
    
    const paginatedCourses = filteredCourses.slice(skip, skip + limit);
  
    return { data: paginatedCourses, total, totalPages };
  }
  async fetchMentorCoursesWithFilters({
  mentorId,
  page = 1,
  limit=2,
  search,
  filters = {},
  sort = { createdAt: -1 },
}: {
  mentorId: string;
  page?: number;
  limit?: number;
  search?: string;
  filters?: { categoryId?: string };
  sort?: { [key: string]: 1 | -1 };
}): Promise<{ data: IPopulatedCourse[]; total: number; totalPages: number }> {
  const query: any = { mentorId };

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  const total = await CourseModel.countDocuments(query);
  const data = await CourseModel.find(query)
  .populate("mentorId")
  .populate("categoryId")
  .sort(sort)
  .skip((page - 1) * limit)
  .limit(limit)
  .lean<IPopulatedCourse[]>(); 



  return {
    data,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

  
}
