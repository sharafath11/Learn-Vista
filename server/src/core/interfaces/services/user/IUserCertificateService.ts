import { CreateCertificateInput, ICertificate } from "../../../../types/certificateTypes";

export interface IUserCertificateService {
  createCertificate(data: CreateCertificateInput): Promise<ICertificate>
    getCertificates(filters: {
    search?: string
    sort?: string
    page: number
    limit: number
  }): Promise<{ data: ICertificate[]; total: number }>

  getCertificateById(id: string): Promise<ICertificate | null>
}
