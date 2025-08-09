import { IConcern } from "../types/concernTypes";
import { throwError } from "../utils/ResANDError";
import { VALIDATION_MESSAGES } from "../constants/validationMessages";

export function validateConcernPayload(data: Partial<IConcern>): void {
  if (
    !data.message ||
    typeof data.message !== "string" ||
    data.message.trim() === ""
  ) {
    throwError(VALIDATION_MESSAGES.CONCERN.MESSAGE_REQUIRED);
  }

  if (!data.courseId) {
    throwError(VALIDATION_MESSAGES.CONCERN.COURSE_ID_REQUIRED);
  }

  if (!data.mentorId) {
    throwError(VALIDATION_MESSAGES.CONCERN.MENTOR_ID_REQUIRED);
  }

  if (data.attachments && !Array.isArray(data.attachments)) {
    throwError(VALIDATION_MESSAGES.CONCERN.ATTACHMENTS_INVALID);
  }

  if (data.attachments?.length) {
    for (const file of data.attachments) {
      const isValidType = ["image", "audio"].includes(file.type);
      if (
        !file.url ||
        typeof file.url !== "string" ||
        !file.filename ||
        typeof file.filename !== "string" ||
        typeof file.size !== "number" ||
        !isValidType
      ) {
        throwError(VALIDATION_MESSAGES.CONCERN.ATTACHMENT_INVALID);
      }
    }
  }
}
