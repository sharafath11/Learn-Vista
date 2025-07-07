import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import LessonModel from "../../models/mentor/class/lessons";
import { ILesson } from "../../types/lessons";
import { BaseRepository } from "../BaseRepository";

export class LessonsRepository extends BaseRepository<ILesson ,ILesson> implements ILessonsRepository{
    constructor() {
        super(LessonModel)
    }
}