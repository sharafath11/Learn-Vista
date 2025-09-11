import { ISessionRepository } from "../../core/interfaces/repositories/course/ISessionRepository";
import SessionModel from "../../models/class/SessionModel";
import { ISession } from "../../types/classTypes";
import { BaseRepository } from "../baseRepository";

export class SessionRepository extends BaseRepository<ISession, ISession> implements ISessionRepository{
    constructor() {
        super(SessionModel)
    }
}