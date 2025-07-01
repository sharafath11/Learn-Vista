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
  receiptUrl?: string;
  donorId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Type for inserting new donation (no Mongoose internals like _id, $clone etc.)
export type CreateDonationInput = Omit<IDonation, keyof Document | "_id">;
