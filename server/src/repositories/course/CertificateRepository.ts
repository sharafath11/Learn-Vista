import mongoose from "mongoose";
import { ICertificateRepository } from "../../core/interfaces/repositories/course/ICertificateRepository";
import CertificateModel from "../../models/class/certificateModel";
import { ICertificate } from "../../types/certificateTypes";
import { toDTO, toDTOArray } from "../../utils/toDTO";
import { BaseRepository } from "../BaseRepository";

export class CertificateRepository extends BaseRepository<ICertificate, ICertificate> implements ICertificateRepository
{
  constructor() {
    super(CertificateModel);
  }

   async findCertificatesWithFilter({
    search,
    sort,
    page,
    limit,
    isRevoked,
  }: {
    search?: string;
    sort?: "latest" | "oldest";
    page: number;
    limit: number;
    isRevoked?: boolean;
  }): Promise<{ data: ICertificate[]; total: number }> { 
    const query: any = {}; 

    if (search) {
      const searchConditions: any[] = [
        { courseTitle: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
        { certificateId: { $regex: search, $options: "i" } } 
      ]
      if (mongoose.Types.ObjectId.isValid(search)) {
        searchConditions.push({ courseId: new mongoose.Types.ObjectId(search) });
      }
      query.$or = searchConditions;
    }
    if (isRevoked !== undefined) {
      query.isRevoked = isRevoked;
    }
    const sortOption: any = {};
    if (sort === "latest") {
      sortOption.issuedAt = -1; 
    } else if (sort === "oldest") {
      sortOption.issuedAt = 1; 
    }
    const [documents, total] = await Promise.all([
      CertificateModel.find(query) 
        .sort(sortOption)
        .skip((page - 1) * limit) 
        .limit(limit) 
        .lean(), 
      CertificateModel.countDocuments(query) 
    ]);
     const toDtoData=toDTOArray<ICertificate>(documents)
    return { data: toDtoData, total };
  }

}
