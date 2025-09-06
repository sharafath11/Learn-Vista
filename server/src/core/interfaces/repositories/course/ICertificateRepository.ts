// src/core/interfaces/repositories/course/ICertificateRepository.ts
import { ICertificate } from "../../../../types/certificateTypes";
import { IBaseRepository } from "../IBaseRepository";

export interface ICertificateRepository extends IBaseRepository<ICertificate, ICertificate>{
    findCertificatesWithFilter(
    filters: {
      search?: string;
      sort?: "latest" | "oldest";
      page: number;
      limit: number;
      isRevoked?: boolean; 
      },
      userId:string
  ): Promise<{ data: ICertificate[]; total: number }>;
}