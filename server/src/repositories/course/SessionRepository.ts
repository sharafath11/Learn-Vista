import { ISessionRepository } from "../../core/interfaces/repositories/course/ISessionRepository";
import SessionModel from "../../models/mentor/class/Session";
import { ISession } from "../../types/classTypes";
import { BaseRepository } from "../BaseRepository";

export class SessionRepository extends BaseRepository<ISession, ISession> implements ISessionRepository{
    constructor() {
        super(SessionModel)
    }
}