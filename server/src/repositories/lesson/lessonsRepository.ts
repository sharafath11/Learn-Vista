import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import LessonModel from "../../models/class/LessonsModel";
import { ILesson } from "../../types/lessons";
import { BaseRepository } from "../baseRepository";

export class LessonsRepository extends BaseRepository<ILesson ,ILesson> implements ILessonsRepository{
    constructor() {
        super(LessonModel)
    }
}