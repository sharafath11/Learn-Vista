import { IUserCourseProgressRepository } from "../../core/interfaces/repositories/user/IUserCourseProgressRepository";
import UserCourseProgressModel from "../../models/user/UserCourseProgress";
import { IUserCourseProgress } from "../../types/userCourseProgress";
import { BaseRepository } from "../BaseRepository";

export class UserCourseProgressRepository extends BaseRepository <IUserCourseProgress,IUserCourseProgress> implements IUserCourseProgressRepository {
    constructor() {
     super(UserCourseProgressModel)
 }
}