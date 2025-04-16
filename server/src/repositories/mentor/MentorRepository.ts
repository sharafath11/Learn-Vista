import { injectable } from 'inversify';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentor } from '../../types/mentorTypes';
import { BaseRepository } from '../BaseRepository';
import MentorModel from '../../models/mentor/mentorModel';


@injectable()
export class MentorRepository extends BaseRepository<IMentor,IMentor> implements IMentorRepository {
  constructor() {
    super(MentorModel)
  }
}
