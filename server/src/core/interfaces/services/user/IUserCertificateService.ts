import { CreateCertificateInput, ICertificate } from "../../../../types/certificateTypes";

export interface IUserCertificateService {
  createCertificate(data: CreateCertificateInput): Promise<ICertificate>
}
