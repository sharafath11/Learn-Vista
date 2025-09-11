import { IQuestionsRepository } from "../../core/interfaces/repositories/lessons/IQuestionsRepository";
import questionModel from "../../models/class/QuestionsModel";
import { IQuestions } from "../../types/lessons";
import { BaseRepository } from "../baseRepository";


export class QuestionsRepository extends BaseRepository<IQuestions ,IQuestions> implements IQuestionsRepository{
    constructor() {
        super(questionModel)
    }
}