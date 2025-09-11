import { Request, Response } from "express";
import { IUserDonationController } from "../../core/interfaces/controllers/user/IUserDonation.controller";
import Stripe from "stripe";
import {
  handleControllerError,
  sendResponse,
  throwError,
} from "../../utils/resAndError";
import { StatusCode } from "../../enums/statusCode.enum";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserDonationServices } from "../../core/interfaces/services/user/IUserDonationServices";
import { decodeToken } from "../../utils/jwtToken";
import { Messages } from "../../constants/messages";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil",
});
@injectable()
export class UserDonationController implements IUserDonationController {
  constructor(
    @inject(TYPES.UserDonationServices)
    private _donationService: IUserDonationServices,
  ) {}

  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { amount, currency } = req.body;
      if (!amount || typeof amount !== "number" || amount <= 0) {
        throwError(
         Messages.DONATION.INVALID_AMOUNT,
          StatusCode.BAD_REQUEST
        );
      }
      if (!currency || typeof currency !== "string" || currency.length !== 3) {
        throwError(
          Messages.DONATION.INVALID_CURRENCY,
          StatusCode.BAD_REQUEST
        );
      }
      const successUrl = `${process.env.FRONTEND_URL}/user/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${process.env.FRONTEND_URL}/user/cancel`;

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
        Messages.DONATION.CHECKOUT_SESSION_CREATED,
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
        throwError(Messages.DONATION.MISSING_SESSION_ID, StatusCode.BAD_REQUEST);
      }
      const io = req.app.get("io");
      const decoded = decodeToken(req.cookies.token);
      const userId = decoded?.id || "anonymous";
      const donation = await this._donationService.verifyDonation(
        sessionId,
        io,
        userId
      );
      sendResponse(res, StatusCode.OK,  Messages.DONATION.VERIFIED, true, donation);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
  async getPaginatedDonations(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.params.page || "1", 10);
      if (isNaN(page) || page < 1) {
        throwError(Messages.DONATION.INVALID_PAGE, StatusCode.BAD_REQUEST);
      }

      const decoded = decodeToken(req.cookies.token);
      const userId = decoded?.id;
      if (!userId) {
        throwError(Messages.COMMON.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }

      const result = await this._donationService.getPaginatedDonations(
        userId,
        page
      );
      
      sendResponse(
        res,
        StatusCode.OK,
        Messages.DONATION.FETCHED,
        true,
        result
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
