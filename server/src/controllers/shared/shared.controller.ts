import { Request, Response } from "express";
import { getSignedS3Url } from "../../utils/s3Utilits";
import {
  handleControllerError,
  sendResponse,
  throwError,
} from "../../utils/resAndError";
import { StatusCode } from "../../enums/statusCode.enum";
import { ISharedController } from "../../core/interfaces/controllers/shared/IShared.controller";
import { refreshAccessToken, setTokensInCookies } from "../../utils/jwtToken";
import { batmanPrompt } from "../../utils/rportprompt";
import { getAIResponse } from "../../config/gemaniAi";
import { Messages } from "../../constants/messages";

export class SharedController implements ISharedController {
  async getSignedS3Url(req: Request, res: Response) {
    const { key } = req.body;

    if (!key) {
      throwError(Messages.SHARED.KEY_NOT_FOUND);
    }

    try {
      const signedUrl = await getSignedS3Url(key);
      sendResponse(res, StatusCode.OK, Messages.SHARED.KEY_NOT_FOUND, true, {
        signedUrl,
      });
    } catch (err) {
      handleControllerError(res, err);
    }
  }
  async refeshToken(req: Request, res: Response): Promise<void> {
    try {
      const tokens = refreshAccessToken(req.cookies.refreshToken);

      if (!tokens) {
        sendResponse(
          res,
          StatusCode.UNAUTHORIZED,
          Messages.SHARED.INVALID_TOKEN,
          false
        );
        return;
      }
      setTokensInCookies(res, tokens.accessToken, tokens.refreshToken);
      sendResponse(res, StatusCode.OK, Messages.SHARED.TOKENS_REFRESHED, true);
      return;
    } catch (error) {
      handleControllerError(res, error, StatusCode.UNAUTHORIZED);
      return;
    }
  }
  async batmanAi(req: Request, res: Response): Promise<void> {
    try {
      const prompt = batmanPrompt(req.body.text);
      const answer = await getAIResponse(prompt);
      sendResponse(
        res,
        StatusCode.OK,
        Messages.SHARED.AI_RESPONSE_FETCHED,
        true,
        answer
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
