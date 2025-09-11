import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserCertificateController } from "../../core/interfaces/controllers/user/IUserCertificate.controller";
import { IUserCertificateService } from "../../core/interfaces/services/user/IUserCertificateService";
import { TYPES } from "../../core/types";
import {
  handleControllerError,
  sendResponse,
  throwError,
} from "../../utils/resAndError";
import { StatusCode } from "../../enums/statusCode.enum";
import { CertificateQueryParams } from "../../types/certificateTypes";
import { Messages } from "../../constants/messages";
import { decodeToken } from "../../utils/jwtToken";

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
        sort: ALLOWED_SORTS.includes(String(sort))
          ? (String(sort) as "latest" | "oldest")
          : "latest",
        page: Math.max(1, Number(page)),
        limit: Math.max(1, Number(limit)),
        isRevoked:
          status === "revoked" ? true : status === "valid" ? false : undefined,
      };

      if (!ALLOWED_STATUSES.includes(String(status))) {
        throwError(Messages.CERTIFICATES.INVALID_STATUS(status as string));
      }
      const decoded = decodeToken(req.cookies.token);

      if (!decoded?.id) {
        return sendResponse(
          res,
          StatusCode.UNAUTHORIZED,
          Messages.COMMON.UNAUTHORIZED,
          false
        );
      }
      const { data, total } =
        await this._userCertificateService.getCertificates(
          filters,
          decoded?.id
        );
      sendResponse(res, StatusCode.OK, Messages.CERTIFICATES.FETCHED, true, {
        data,
        total,
      });
    } catch (error) {
      handleControllerError(res, error);
    }
  }
  async getCertificate(req: Request, res: Response): Promise<void> {
    try {
      const certificateId = req.params.certificateId;
      const certificate = await this._userCertificateService.getCertificateById(
        certificateId
      );
      if (!certificate) {
        return sendResponse(
          res,
          StatusCode.NOT_FOUND,
          Messages.CERTIFICATES.CERTIFICATE_NOT_FOUND,
          false
        );
      }
      sendResponse(
        res,
        StatusCode.OK,
        Messages.CERTIFICATES.FETCHED,
        true,
        certificate
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
