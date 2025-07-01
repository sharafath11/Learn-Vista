import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { IUserDonationServices } from "../../core/interfaces/services/user/IUserDonationServices";
import { TYPES } from "../../core/types";
import { IDonationRepoitory } from "../../core/interfaces/repositories/donation/IDonationRepoitory";
import { CreateDonationInput, IDonation } from "../../types/donationTypes";
import { throwError } from "../../utils/ResANDError";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

@injectable()
export class UserDonationServices implements IUserDonationServices {
  constructor(
    @inject(TYPES.DonationRepository)
    private _donationRepo: IDonationRepoitory
  ) {}

  async verifyDonation(sessionId: string): Promise<IDonation> {
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
      console.log("⚠️ Donation already recorded for this paymentIntent:", paymentIntent.id);
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
    return await this._donationRepo.create(donation);
  }
}
