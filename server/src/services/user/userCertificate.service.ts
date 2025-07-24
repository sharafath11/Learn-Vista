import { inject, injectable } from "inversify"
import { ICertificateRepository } from "../../core/interfaces/repositories/course/ICertificateRepository"
import { IUserCertificateService } from "../../core/interfaces/services/user/IUserCertificateService"
import { TYPES } from "../../core/types"

import { CreateCertificateInput, ICertificate } from "../../types/certificateTypes"
import { formatIssuedDate, generateCertificateId, generateQRCode } from "../../utils/ certificateUtils"

@injectable()
export class UserCertificateService implements IUserCertificateService {
  constructor(
    @inject(TYPES.CertificateRepository)
    private _certificateRepo: ICertificateRepository
  ) {}

  async createCertificate(data: CreateCertificateInput): Promise<ICertificate> {
      const certificateId = generateCertificateId()
      console.log("hyloo")
    const qrCodeUrl = await generateQRCode(certificateId)

    const newCertificate: Partial<ICertificate> = {
      userId: data.userId, 
      userName: data.userName,
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      certificateId,
      qrCodeUrl,
        isRevoked: false,
      issuedDateFormatted:formatIssuedDate(new Date()),
      issuedAt: new Date(),
    }

    return await this._certificateRepo.create(newCertificate as ICertificate)
  }
   async getCertificates(filters: {
    search?: string;
    sort?: "latest" | "oldest";
    page: number;
    limit: number;
    isRevoked?: boolean;
  }): Promise<{ data: ICertificate[]; total: number }> {
    const { data, total } = await this._certificateRepo.findCertificatesWithFilter(filters);
    return { data, total };
  }
  async getCertificateById(id: string): Promise<ICertificate | null> {
    return await this._certificateRepo.findOne({certificateId:id})
  }

}
