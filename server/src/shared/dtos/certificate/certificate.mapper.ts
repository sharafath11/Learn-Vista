import { ICertificate } from "../../../types/certificateTypes";
import { ICertificateResponseDto } from "./certificate-response.dto";

export class CertificateMapper {
    static certificateResponseDto(c: ICertificate): ICertificateResponseDto{
        return {
            certificateId: c.certificateId,
            courseTitle: c.courseTitle,
            isRevoked: c.isRevoked,
            issuedDateFormatted: c.issuedDateFormatted,
            qrCodeUrl: c.qrCodeUrl,
            userName:c.userName
        }
    }
}