import { IUserCourseProgressRepository } from "../../core/interfaces/repositories/user/IUserCourseProgressRepository";
import UserCourseProgressModel from "../../models/user/UserCourseProgressModel";
import { IUserCourseProgress } from "../../types/userCourseProgress";
import { BaseRepository } from "../baseRepository";

export class UserCourseProgressRepository extends BaseRepository <IUserCourseProgress,IUserCourseProgress> implements IUserCourseProgressRepository {
    constructor() {
     super(UserCourseProgressModel)
 }
}