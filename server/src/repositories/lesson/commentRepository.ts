import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";
import Comment from "../../models/class/comments";
import { IComment } from "../../types/lessons";
import { BaseRepository } from "../BaseRepository";

export class CommentsRepository extends BaseRepository<IComment ,IComment> implements ICommentstRepository{
    constructor() {
        super(Comment)
    }
}