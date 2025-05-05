import { injectable } from 'inversify';
import { BaseRepository } from '../BaseRepository';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { ICategory, ICourse, IPopulatedCourse } from '../../types/classTypes';
import CourseModel from '../../models/class/courseModel';
import { IMentor } from '../../types/mentorTypes';


@injectable()
export class CourseRepository extends BaseRepository<ICourse, ICourse> implements ICourseRepository {
  constructor() {
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
}
