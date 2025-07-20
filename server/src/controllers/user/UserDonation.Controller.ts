import { Request, Response } from "express";
import { IUserDonationController } from "../../core/interfaces/controllers/user/IUserDonationController";
import Stripe from "stripe";
import {
  handleControllerError,
  sendResponse,
  throwError,
} from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserDonationServices } from "../../core/interfaces/services/user/IUserDonationServices";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { decodeToken } from "../../utils/JWTtoken";
import { logger } from "../../utils/logger";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil",
});
@injectable()
export class UserDonationController implements IUserDonationController {
  constructor(
    @inject(TYPES.UserDonationServices)
    private _donationService: IUserDonationServices,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService
  ) {}

  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { amount, currency } = req.body;
      if (!amount || typeof amount !== "number" || amount <= 0) {
        throwError(
          "Invalid amount provided. Amount must be a positive number.",
          StatusCode.BAD_REQUEST
        );
      }
      if (!currency || typeof currency !== "string" || currency.length !== 3) {
        throwError(
          "Invalid currency provided. Currency must be a 3-letter code.",
          StatusCode.BAD_REQUEST
        );
      }
      const successUrl = `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${process.env.FRONTEND_URL}/cancel`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: "Donation",
                description: "Support our educational platform!",
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      sendResponse(
        res,
        StatusCode.OK,
        "Checkout session created successfully.",
        true,
        { id: session.id }
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }
  async verifySession(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = req.params.sessionId;
      if (!sessionId) {
        throwError("Missing session_id", StatusCode.BAD_REQUEST);
      }
      const io = req.app.get("io");
      const decoded = decodeToken(req.cookies.token);
      const userId = decoded?.id || "anonymous";
      const donation = await this._donationService.verifyDonation(
        sessionId,
        io,
        userId
      );
      sendResponse(res, StatusCode.OK, "Donation verified", true, donation);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
  async getPaginatedDonations(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.params.page || "1", 10);
      if (isNaN(page) || page < 1) {
        throwError("Invalid page number.", StatusCode.BAD_REQUEST);
      }

      const decoded = decodeToken(req.cookies.token);
      const userId = decoded?.id;
      if (!userId) {
        throwError("Unauthorized user", StatusCode.UNAUTHORIZED);
      }

      const result = await this._donationService.getPaginatedDonations(
        userId,
        page
      );
      
      sendResponse(
        res,
        StatusCode.OK,
        "Donations fetched successfully",
        true,
        result
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
