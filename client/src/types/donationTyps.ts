export interface IDonation{
  id:string
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  message?: string;
  status: "processing" | "succeeded" | "failed" | "canceled";
  paymentIntentId: string;
  stripeCustomerId?: string;
  receiptUrl?: string;
  donorId?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IStripeSuccessSession {
  id?:string
  customer_email: string;
  amount_total: number;
  receipt_url: string;
  payment_intent?: string
  paymentIntentId:string
}