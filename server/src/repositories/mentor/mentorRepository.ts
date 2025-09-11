import { injectable } from 'inversify';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentor } from '../../types/mentorTypes';
import { BaseRepository } from '../baseRepository';
import MentorModel from '../../models/mentor/MentorModel';


@injectable()
export class MentorRepository extends BaseRepository<IMentor,IMentor> implements IMentorRepository {
  constructor() {
    super(MentorModel)
  }
}
