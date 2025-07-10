import { IQuestionsRepository } from "../../core/interfaces/repositories/lessons/IQuestionsRepository";
import questionModel from "../../models/mentor/class/questions";
import { IQuestions } from "../../types/lessons";
import { BaseRepository } from "../BaseRepository";


export class QuestionsRepository extends BaseRepository<IQuestions ,IQuestions> implements IQuestionsRepository{
    constructor() {
        super(questionModel)
    }
}