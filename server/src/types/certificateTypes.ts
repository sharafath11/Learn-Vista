import { Document, ObjectId, Types } from "mongoose"

export interface ICertificate extends Document {
  userId: ObjectId|string
  userName: string
  courseId: ObjectId |string
  courseTitle: string
  certificateId: string
  issuedAt: Date
  issuedDateFormatted: string;
  qrCodeUrl: string;
  isRevoked: boolean;

}

export interface CreateCertificateInput {
  userId: string|ObjectId
  userName: string
  courseId: string|ObjectId
  courseTitle: string
}

export interface CertificateQueryParams {
  search?: string;
  sort?: "latest" | "oldest";
  page?: string;
  limit?: string;
  status?: "all" | "revoked" | "valid";
}