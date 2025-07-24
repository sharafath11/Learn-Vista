export interface ICertificate {
  id:string
  userId: string
  userName: string
  courseId: string
  courseTitle: string
  certificateId: string
  issuedAt: string 
  issuedDateFormatted: string
  qrCodeUrl: string
  isRevoked: boolean
}
