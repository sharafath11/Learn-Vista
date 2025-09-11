import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { IUserDonationServices } from "../../core/interfaces/services/user/IUserDonationServices";
import { TYPES } from "../../core/types";
import { IDonationRepoitory } from "../../core/interfaces/repositories/donation/IDonationRepoitory";
import { CreateDonationInput} from "../../types/donationTypes";
import { throwError } from "../../utils/resAndError";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { Server } from "socket.io";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import dotenv from "dotenv"
import { Messages } from "../../constants/messages";
import { DonationMapper } from "../../shared/dtos/donation/donation.mapper";
import { IUSerDonationResponseDto } from "../../shared/dtos/donation/donation-response.dto";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});
dotenv.config()
@injectable()
export class UserDonationServices implements IUserDonationServices {
  constructor(
    @inject(TYPES.DonationRepository) private _donationRepo: IDonationRepoitory,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService
  ) {}

  async verifyDonation(sessionId: string, io?: Server, userId?: string): Promise<IUSerDonationResponseDto> {
  if (!sessionId) throwError("Missing session_id");

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent", "payment_intent.latest_charge", "customer"],
  });

  const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
  const latestChargeRaw = paymentIntent.latest_charge;

  const chargeId =
    typeof latestChargeRaw === "string"
      ? latestChargeRaw
      : (latestChargeRaw as Stripe.Charge)?.id;

  if (!chargeId) throwError(Messages.DONATION.MISSING_CHARGE_ID);


  const charge = await stripe.charges.retrieve(chargeId);
  const receiptUrl = charge.receipt_url || "";
  const existing = await this._donationRepo.findByPaymentIntentId(paymentIntent.id);
  if (existing) {
    return DonationMapper.toUserDonationResponseDto(existing)
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
    donorId:userId?userId:"unknown",
    transactionId: charge.id, 
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const ADMIN_ID = process.env.ADMIN_ID;
  if (!ADMIN_ID) throwError(Messages.CONFIG.ADMIN_ID_MISSING);

  if (userId) {
  await notifyWithSocket({
  notificationService: this._notificationService,
  userIds: [userId, ADMIN_ID],
  roles: ["admin"],
  title: Messages.DONATION.SUCCESS_TITLE,
  message: Messages.DONATION.SUCCESS_MESSAGE(donation.amount,donation.donorName),
  type: "success",
});

  }
  const savedDonation = await this._donationRepo.create(donation);
  return DonationMapper.toUserDonationResponseDto(savedDonation);
  }
async getPaginatedDonations(userId: string, page: number): Promise<{
  data: IUSerDonationResponseDto[];
  total: number;
  hasMore: boolean;
}> {
  const limit = 10;
  const skip = (page - 1) * limit;
  const filters = { donorId: userId };
  const sort: Record<string, 1 | -1> = { createdAt: -1 };
  const data = await this._donationRepo.findManyWithFilter(filters, sort, skip, limit);
  const total = await this._donationRepo.count(filters);
  const hasMore = skip + data.length < total;
  const sendData=data.map((i)=>DonationMapper.toUserDonationResponseDto(i))
  return { data:sendData, total, hasMore };
}
}
