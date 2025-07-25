import { Request, Response } from "express";
import { getSignedS3Url } from "../../utils/s3Utilits";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { ISharedController } from "../../core/interfaces/controllers/shared/ISharedController";

export class SharedController implements ISharedController {
  async getSignedS3Url(req: Request, res: Response) {
    const { key } = req.body;

    if (!key) {
      throwError("Key not found");
    }

    try {
      const signedUrl = await getSignedS3Url(key);
      sendResponse(res, StatusCode.OK, "Signed URL fetched successfully", true, { signedUrl });
    } catch (err) {
      handleControllerError(res, err);
    }
  }
}
