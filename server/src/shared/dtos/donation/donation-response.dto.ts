export interface IDonationResponseDto {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  message?: string;
  status: "processing" | "succeeded" | "failed" | "canceled";
  paymentIntentId: string;
  stripeCustomerId?: string;
  transactionId?: string;
  receiptUrl?: string;
  donorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminDonationResponseDto {
  id: string;
  donorName: string;
  amount: number;
  date: Date;
  status: "processing" | "succeeded" | "failed" | "canceled";
}
