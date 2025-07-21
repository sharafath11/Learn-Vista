import mongoose, { Schema } from "mongoose"
import { ICertificate } from "../../types/certificateTypes"

const CertificateSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  qrCodeUrl: {
    type: String,
    required: true,
    },
  issuedDateFormatted:{type:String,required:true},
  isRevoked: {
    type: Boolean,
    default: false,
  },
})

const CertificateModel = mongoose.model<ICertificate>("Certificate", CertificateSchema)
export default CertificateModel
