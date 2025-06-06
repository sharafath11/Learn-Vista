// src/repositories/user/OtpRepository.ts
import { injectable } from "inversify";
import { OtpModel } from "../../models/user/otpModel";
import { BaseRepository } from "../BaseRepository";
import { IOtp } from "../../types/userTypes";
import { IOtpRepository } from "../../core/interfaces/repositories/user/IOtpRepository";

@injectable()
export class OtpRepository extends BaseRepository<IOtp, IOtp> implements  IOtpRepository {
  constructor() {
    super(OtpModel);
  }
}