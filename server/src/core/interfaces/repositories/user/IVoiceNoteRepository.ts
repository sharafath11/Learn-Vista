import { FilterQuery } from "mongoose";
import { IVoiceNote } from "../../../../types/lessons";
import { IBaseRepository } from "../IBaseRepository";

export interface IVoiceNoteRepository extends IBaseRepository<IVoiceNote, IVoiceNote> {
  findAllWithSort(
    filter?: FilterQuery<IVoiceNote>,
    sort?: Record<string, 1 | -1>
  ): Promise<IVoiceNote[]>;
}
