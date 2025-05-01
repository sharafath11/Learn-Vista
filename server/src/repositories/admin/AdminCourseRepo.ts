import { injectable } from "inversify";
import { BaseRepository } from "../BaseRepository";
import { ICourse } from "../../types/classTypes";
import { IAdminCourserRepository } from "../../core/interfaces/repositories/admin/IAdminCourseRepository";
import CourseModal from "../../models/class/courseModel";

@injectable()
export class AdminCourseRepository extends BaseRepository<ICourse, ICourse> implements IAdminCourserRepository {
    constructor() {
      super(CourseModal);
    }
  }