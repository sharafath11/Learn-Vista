import { Schema, model, Types } from "mongoose";
import { IDonation } from "../../types/donationTypes";

const DonationSchema = new Schema<IDonation>(
  {
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["processing", "succeeded", "failed", "canceled"],
      required: true,
    },
    paymentIntentId: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String },
    receiptUrl: { type: String },
    donorId: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const DonationModel = model<IDonation>("Donation", DonationSchema);
