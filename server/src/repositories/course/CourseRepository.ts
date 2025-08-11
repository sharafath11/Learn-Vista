import { inject, injectable } from 'inversify';
import { FilterQuery, ObjectId } from 'mongoose';
import { BaseRepository } from '../BaseRepository';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { ICategory, ICourse,  IPopulatedCourse } from '../../types/classTypes';
import CourseModel from '../../models/class/courseModel';
import { ICategoriesRepository } from '../../core/interfaces/repositories/course/ICategoriesRepository';
import { TYPES } from '../../core/types';
import { throwError } from '../../utils/ResANDError';
import { toDTOArray } from '../../utils/toDTO';
import { IMentor } from '../../types/mentorTypes';
import { Messages } from '../../constants/messages';
import { StatusCode } from '../../enums/statusCode.enum';

interface CourseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: { categoryId?: string };
  sort?: { [key: string]: 1 | -1 };
}

@injectable()
export class CourseRepository extends BaseRepository<ICourse, ICourse> implements ICourseRepository {
  constructor(
    @inject(TYPES.CategoriesRepository)
    private _catRepo: ICategoriesRepository
  ) {
    super(CourseModel);
  }

  async findWithMenorIdgetAllWithPopulatedFields(id: string | ObjectId): Promise<IPopulatedCourse[]> {
    const courses = await CourseModel.find({ mentorId: id })
      .populate('mentorId')
      .populate('categoryId')
      .lean<IPopulatedCourse[]>();
    const toDtoData=toDTOArray<IPopulatedCourse>(courses)
    return toDtoData.map(course => ({
      ...course,
      mentorId: course.mentorId as IMentor,
      categoryId: course.categoryId as ICategory,
    }));
  }

  async populateWithAllFildes(): Promise<IPopulatedCourse[]> {
    const courses = await CourseModel.find()
      .populate('mentorId')
      .populate('categoryId')
      .lean<IPopulatedCourse[]>();
        const toDtoData=toDTOArray<IPopulatedCourse>(courses)

    return toDtoData.map(course => ({
      ...course,
      mentorId: course.mentorId as IMentor,
      categoryId: course.categoryId as ICategory,
    }));
  }

  async fetchAllCoursesWithFilters(params: CourseQueryParams): Promise<{
    data: IPopulatedCourse[];
    total: number;
    totalPages: number;
  }> {
    const { page = 1,  search, filters,limit = 10, sort } = params;
    const query: FilterQuery<ICourse> = {};
   

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (filters?.categoryId && filters.categoryId !== 'All') {
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

    courseQuery = sort && Object.keys(sort).length
      ? courseQuery.sort(sort)
      : courseQuery.sort({ createdAt: -1 });

    const allCourses = await courseQuery.lean<IPopulatedCourse[]>();

    const filteredCourses = allCourses
      .map(course => ({
        ...course,
        mentorId: course.mentorId as IMentor,
        categoryId: course.categoryId as ICategory,
      }))
      .filter(course => !course.isBlock && !course.categoryId.isBlock && course.isActive);

    const total = filteredCourses.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedCourses = filteredCourses.slice((page - 1) * limit, page * limit);
       const toDtoData=toDTOArray<IPopulatedCourse>(paginatedCourses)
    return { data: toDtoData , total, totalPages };
  }

  async fetchMentorCoursesWithFilters({
    mentorId,
    page = 1,
    limit = 2,
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
    const query: FilterQuery<ICourse> = { mentorId };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (filters.categoryId) {
      query.categoryId = filters.categoryId;
    }
    const total = await CourseModel.countDocuments(query);
    const courses = await CourseModel.find(query)
      .populate('mentorId')
      .populate('categoryId')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IPopulatedCourse[]>();

    const data = toDTOArray<IPopulatedCourse>(courses);

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async AdmingetClassRepo(
    page = 1,
    limit :number,
    search?: string,
    filters: FilterQuery<ICourse> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: ICourse[]; total: number; totalPages: number }> {
    limit=2
    try {
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filters.$or = [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { tag: { $regex: searchRegex } },
        ];
      }

      const skip = (page - 1) * limit;

      const query = this.model
        .find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('mentorId')
        .populate('categoryId')
        .lean<ICourse[]>();

      const [documents, total] = await Promise.all([
        query,
        this.model.countDocuments(filters),
      ]);

      
    
      return {
        data:documents,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throwError(Messages.COURSE.FETCH_FAILED,StatusCode.INTERNAL_SERVER_ERROR);
    }
  }
}
