import { ILessonReportRepository } from "../../core/interfaces/repositories/lessons/ILessonReportRepository";
import { LessonReport } from "../../models/mentor/class/lessonReport";
import { ILessonReport } from "../../types/lessons";
import { BaseRepository } from "../BaseRepository";

export class LessonReportRepository extends BaseRepository<ILessonReport ,ILessonReport> implements ILessonReportRepository{
    constructor() {
        super(LessonReport)
    }
}