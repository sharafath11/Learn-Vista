import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { IUserDonationServices } from "../../core/interfaces/services/user/IUserDonationServices";
import { TYPES } from "../../core/types";
import { IDonationRepoitory } from "../../core/interfaces/repositories/donation/IDonationRepoitory";
import { CreateDonationInput, IDonation } from "../../types/donationTypes";
import { throwError } from "../../utils/ResANDError";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { Server } from "socket.io";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import dotenv from "dotenv"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});
dotenv.config()
@injectable()
export class UserDonationServices implements IUserDonationServices {
  constructor(
    @inject(TYPES.DonationRepository)
    private _donationRepo: IDonationRepoitory,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService
  ) {}

  async verifyDonation(sessionId: string,io?:Server,userId?:string): Promise<IDonation> {
    if (!sessionId) throwError(" Missing session_id");

    console.log(" Verifying Stripe session ID:", sessionId);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "payment_intent.latest_charge", "customer"],
    });


    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    const latestChargeRaw = paymentIntent.latest_charge;

    const chargeId =
      typeof latestChargeRaw === "string"
        ? latestChargeRaw
        : (latestChargeRaw as Stripe.Charge)?.id;

    if (!chargeId) {
      throwError("Could not determine charge ID");
    }

    const charge = await stripe.charges.retrieve(chargeId);

    console.log("Charge retrieved:", {
      id: charge.id,
      status: charge.status,
      receipt_url: charge.receipt_url,
    });

    const receiptUrl = charge.receipt_url || "";

    const existing = await this._donationRepo.findByPaymentIntentId(paymentIntent.id);
    if (existing) {
      console.log(" Donation already recorded for this paymentIntent:", paymentIntent.id);
      return existing;
    }

    const donation: CreateDonationInput = {
      donorName: session.customer_details?.name || "Anonymous",
      donorEmail: session.customer_details?.email || "unknown@example.com",
      amount: (session.amount_total || 0) / 100,
      currency: session.currency ?? "inr",
      message: "",
      status: charge.status as CreateDonationInput["status"],
      paymentIntentId: paymentIntent.id,
      stripeCustomerId: session.customer?.toString() || "",
      receiptUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const ADMIN_ID=process.env.ADMIN_ID
    if(!ADMIN_ID) throwError("somthing wront wrong")
     if (userId) {
  await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [userId,ADMIN_ID], 
    roles: ["admin"],
    title: "🎉 Donation Successful",
    message: `User donated ₹${donation.amount}. Thank you!`,
    type: "success",
  });
}

    return await this._donationRepo.create(donation);
  }
}
