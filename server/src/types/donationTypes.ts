import { Document, Types } from "mongoose";

export interface IDonation extends Document {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  message?: string;
  status: "processing" | "succeeded" | "failed" | "canceled";
  paymentIntentId: string;
  stripeCustomerId?: string;
  transactionId?: string
  receiptUrl?: string;
  donorId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export type CreateDonationInput = Omit<IDonation, keyof Document | "_id">;
