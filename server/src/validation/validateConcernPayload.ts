

import { IConcern } from "../types/concernTypes";
import { throwError } from "../utils/ResANDError";

export function validateConcernPayload(data: Partial<IConcern>): void {
  if (!data.message || typeof data.message !== "string" || data.message.trim() === "") {
   throwError("Message is required and must be a non-empty string.");
  }

  if (!data.courseId) {
   throwError("Course ID is required.");
  }

  if (!data.mentorId) {
    throwError("Mentor ID is required.");
  }

  if (data.attachments && !Array.isArray(data.attachments)) {
   throwError("Attachments must be an array.");
  }

  if (data.attachments?.length) {
    for (const file of data.attachments) {
      if (
        !file.url ||
        typeof file.url !== "string" ||
        !file.filename ||
        typeof file.filename !== "string" ||
        typeof file.size !== "number" ||
        !["image", "audio"].includes(file.type)
      ) {
       throwError("Each attachment must include url, filename, size, and valid type (image/audio).");
      }
    }
  }
}
