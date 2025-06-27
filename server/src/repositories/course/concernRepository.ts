import { IConcernRepository } from "../../core/interfaces/repositories/concern/IConcernRepository";
import ConcernModel from "../../models/class/concernModel";
import { IConcern } from "../../types/concernTypes";
import { BaseRepository } from "../BaseRepository";

export class ConcernRepository extends BaseRepository<IConcern, IConcern> implements IConcernRepository{
    constructor() {
        super(ConcernModel)
    }
}