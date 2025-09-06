import { inject, injectable } from "inversify"
import { ICertificateRepository } from "../../core/interfaces/repositories/course/ICertificateRepository"
import { IUserCertificateService } from "../../core/interfaces/services/user/IUserCertificateService"
import { TYPES } from "../../core/types"

import { CreateCertificateInput, ICertificate } from "../../types/certificateTypes"
import { formatIssuedDate, generateCertificateId, generateQRCode } from "../../utils/ certificateUtils"
import { ICertificateResponseDto } from "../../shared/dtos/certificate/certificate-response.dto"
import { CertificateMapper } from "../../shared/dtos/certificate/certificate.mapper"

@injectable()
export class UserCertificateService implements IUserCertificateService {
  constructor(
    @inject(TYPES.CertificateRepository)
    private _certificateRepo: ICertificateRepository
  ) {}

  async createCertificate(data: CreateCertificateInput): Promise<ICertificateResponseDto> {
      const certificateId = generateCertificateId()
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

    const certificate = await this._certificateRepo.create(newCertificate as ICertificate);
   return CertificateMapper.certificateResponseDto(certificate)
  }
   async getCertificates(filters: {
    search?: string;
    sort?: "latest" | "oldest";
    page: number;
    limit: number;
    isRevoked?: boolean;
  },userId:string): Promise<{ data: ICertificateResponseDto[]; total: number }> {
     const { data, total } = await this._certificateRepo.findCertificatesWithFilter(filters,userId);
     const sendData=data.map((i)=>CertificateMapper.certificateResponseDto(i))
    return { data:sendData, total };
  }
  async getCertificateById(id: string): Promise<ICertificateResponseDto | null> {
    const certificate = await this._certificateRepo.findOne({ certificateId: id });
    if(!certificate) return null
     return CertificateMapper.certificateResponseDto(certificate)
  }

}
