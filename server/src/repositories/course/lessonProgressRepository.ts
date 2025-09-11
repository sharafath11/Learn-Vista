import { IUserLessonProgressRepository } from "../../core/interfaces/repositories/course/IUserLessonProgressRepo";
import { UserLessonProgressModel } from "../../models/user/UserLessonProgressModel";
import { IUserLessonProgress } from "../../types/userLessonProgress";
import { BaseRepository } from "../baseRepository";

export class UserLessonProgresssRepository extends BaseRepository<IUserLessonProgress , IUserLessonProgress> implements IUserLessonProgressRepository{
    constructor() {
        super(UserLessonProgressModel)
    }
    
}