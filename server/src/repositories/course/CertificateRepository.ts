import { ICertificateRepository } from "../../core/interfaces/repositories/course/ICertificateRepository";
import CertificateModel from "../../models/class/certificateModel";
import { ICertificate } from "../../types/certificateTypes";
import { BaseRepository } from "../BaseRepository";


export class CertificateRepository extends BaseRepository<ICertificate , ICertificate> implements ICertificateRepository{
    constructor() {
        super(CertificateModel)
    }
}