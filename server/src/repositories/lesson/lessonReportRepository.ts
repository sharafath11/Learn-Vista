import { ILessonReportRepository } from "../../core/interfaces/repositories/lessons/ILessonReportRepository";
import { LessonReport } from "../../models/class/LessonReportModel";
import { ILessonReport } from "../../types/lessons";
import { BaseRepository } from "../baseRepository";

export class LessonReportRepository extends BaseRepository<ILessonReport ,ILessonReport> implements ILessonReportRepository{
    constructor() {
        super(LessonReport)
    }
}