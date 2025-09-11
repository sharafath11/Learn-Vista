import { injectable } from "inversify";
import { BaseRepository } from "../baseRepository";
import { IVoiceNote } from "../../types/lessons";
import { VoiceNoteModel } from "../../models/user/VoiceNoteModel";
import { IVoiceNoteRepository } from "../../core/interfaces/repositories/user/IVoiceNoteRepository";
import { FilterQuery } from "mongoose";
import { Messages } from "../../constants/messages";
@injectable()
export class VoiceNoteRepository extends BaseRepository<IVoiceNote, IVoiceNote> implements  IVoiceNoteRepository {
  constructor() {
    super(VoiceNoteModel);
  }
async findAllWithSort(
  filter: FilterQuery<IVoiceNote> = {},
  sort: Record<string, 1 | -1> = { createdAt: -1 }
): Promise<IVoiceNote[]> {
  try {
    const alldata = await VoiceNoteModel.find();
    const notes = await VoiceNoteModel.find(filter)
      .sort(sort)
      .lean()
      .exec();
    return notes as IVoiceNote[];
  } catch (error) {
    throw this.handleError(error, Messages.REPOSITORY.FIND_ALL_ERROR);
  }
}

}