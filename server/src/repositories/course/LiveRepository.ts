import { ILiveRepository } from "../../core/interfaces/repositories/course/ILiveRepository";
import LiveClassModel from "../../models/class/LiveClass";
import { ILiveClass } from "../../types/classTypes";
import { BaseRepository } from "../BaseRepository";

export class LiveRepository extends BaseRepository<ILiveClass , ILiveClass> implements ILiveRepository{
    constructor() {
        super(LiveClassModel)
    }
}