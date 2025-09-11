import { ILiveRepository } from "../../core/interfaces/repositories/course/ILiveRepository";
import LiveClassModel from "../../models/class/LiveClassModel";
import { ILiveClass } from "../../types/classTypes";
import { BaseRepository } from "../baseRepository";

export class LiveRepository extends BaseRepository<ILiveClass , ILiveClass> implements ILiveRepository{
    constructor() {
        super(LiveClassModel)
    }
}