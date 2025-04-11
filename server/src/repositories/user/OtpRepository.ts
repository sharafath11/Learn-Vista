import { injectable } from "inversify";
import { IOtp } from "../../types/userTypes";
import { OtpModel } from "../../models/user/otpModel";

@injectable()
export class OtpRepository {
  async findOne(query: object): Promise<IOtp | null> {
    return await OtpModel.findOne(query);
  }

  async create(data: Partial<IOtp>): Promise<IOtp> {
    return await OtpModel.create(data);
  }

  async delete(query: object): Promise<void> {
    await OtpModel.deleteOne(query);
  }
}