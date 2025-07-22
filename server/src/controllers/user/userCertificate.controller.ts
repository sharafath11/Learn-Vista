import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserCertificateController } from "../../core/interfaces/controllers/user/IUserCertificateController";
import { IUserCertificateService } from "../../core/interfaces/services/user/IUserCertificateService";
import { TYPES } from "../../core/types";
import { handleControllerError, sendResponse } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { CertificateQueryParams } from "../../types/certificateTypes";

@injectable()
export class UserCertificateController implements IUserCertificateController {
  constructor(
    @inject(TYPES.UserCertificateService)
    private _userCertificateService: IUserCertificateService
  ) {}

   async getCertificates(req: Request, res: Response): Promise<void> {
  try {
    const {
      search = "",
      sort = "latest",
      page = "1",
      limit = "10",
      status = "all",
    } = req.query.params as CertificateQueryParams;

    const ALLOWED_SORTS = ["latest", "oldest"];
    const ALLOWED_STATUSES = ["all", "revoked", "valid"];

    const filters = {
      search: String(search).trim(),
      sort: ALLOWED_SORTS.includes(String(sort)) ? String(sort) as "latest" | "oldest" : "latest",
      page: Math.max(1, Number(page)),
      limit: Math.max(1, Number(limit)),
      isRevoked:
        status === "revoked" ? true :
        status === "valid" ? false :
        undefined,
    };

    if (!ALLOWED_STATUSES.includes(String(status))) {
      console.warn(`[GET /certificates] Invalid status '${status}' provided. Defaulting to 'all'.`);
    }

    console.log("[GET /certificates] Resolved filters:", filters);

    const { data, total } = await this._userCertificateService.getCertificates(filters);

    console.log("[GET /certificates] Certificates fetched:", { count: data.length, total });

    sendResponse(res, StatusCode.OK, "Certificates fetched successfully", true, {
      data,
      total,
    });
  } catch (error) {
    console.error("[GET /certificates] Error occurred:", error);
    handleControllerError(res, error);
  }
}
  async getCertificate(req: Request, res: Response): Promise<void> {
    try {
      const certificateId = req.params.certificateId;
      const certificate = await this._userCertificateService.getCertificateById(certificateId);
      if (!certificate) {
        return sendResponse(res, StatusCode.NOT_FOUND, "Certificate not found", false);
      }
      sendResponse(res, StatusCode.OK, "Certificate fetched successfully", true, certificate);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
