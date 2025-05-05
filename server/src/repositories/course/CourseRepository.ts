import { injectable } from 'inversify';
import { BaseRepository } from '../BaseRepository';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { ICourse } from '../../types/classTypes';
import CourseModel from '../../models/class/courseModel';


@injectable()
export class CourseRepository extends BaseRepository<ICourse,ICourse> implements ICourseRepository {
  constructor() {
    super(CourseModel)
  }
}
