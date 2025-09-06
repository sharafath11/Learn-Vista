import { ICertificateResponseDto } from "../../../../shared/dtos/certificate/certificate-response.dto";
import { CreateCertificateInput, ICertificate } from "../../../../types/certificateTypes";

export interface IUserCertificateService {
  createCertificate(data: CreateCertificateInput): Promise<ICertificateResponseDto>
    getCertificates(filters: {
    search?: string
    sort?: string
    page: number
    limit: number
  },userId:string): Promise<{ data: ICertificateResponseDto[]; total: number }>

  getCertificateById(id: string): Promise<ICertificateResponseDto | null>
}
