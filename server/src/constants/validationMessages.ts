export const VALIDATION_MESSAGES = {
  COURSE: {
    MISSING_FIELD: (field: string) => `Missing required field: ${field}`,
    MISSING_THUMBNAIL: "Thumbnail file is required and must be a valid buffer",
  },

  CATEGORY: {
    REQUIRED: "Title and description are required",
    TITLE_MIN_LENGTH: "Title must be at least 3 characters long",
    DESCRIPTION_MIN_LENGTH: "Description must be at least 10 characters long",
  },

  USER: {
    NAME_REQUIRED: "Name is required",
    EMAIL_INVALID: "Please enter a valid email address",
    PASSWORD_WEAK:
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    ROLE_INVALID: "Invalid role",
  },

  MENTOR: {
    FILE_REQUIRED: "No file uploaded",
    REQUIRED_FIELDS: "Email, username, and phone number are required",
    EXPERTISE_INVALID_FORMAT: "Invalid expertise format",
    EXPERTISE_REQUIRED: "At least one area of expertise is required",
    EXPERTISE_INVALID_ITEM: "Each area of expertise must be a non-empty string",
    EMAIL_INVALID: "Please enter a valid email",
    PHONE_INVALID: "Please enter a valid phone number",
    FILE_TYPE_INVALID: "Only PDF files are accepted",
    FILE_TOO_LARGE: "File must be smaller than 5MB",

    INVALID_DATA: "Invalid data provided",
    EMAIL: "Valid email is required",
    PHONE: "Valid 10-digit phone number is required",
    PASSWORD:
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    EXPERIENCE: "Experience must be a number between 0 and 50 years",
    BIO: "Bio must be at least 100 characters long",
    PROFILE_USERNAME_REQUIRED: "Username is required",
    PROFILE_USERNAME_TOO_SHORT: "Username must be at least 3 characters",
    PROFILE_USERNAME_TOO_LONG: "Username must be less than 30 characters",
    PROFILE_USERNAME_INVALID:
      "Username can only contain letters, numbers, and underscores",
    PROFILE_BIO_TOO_SHORT: "Bio must be minimum 50 characters",
    PROFILE_IMAGE_TYPE: "Only JPEG, PNG, WEBP, or GIF images are allowed",
    PROFILE_IMAGE_SIZE: "Image must be smaller than 5MB",
  },

  QUESTION: {
    TEXT_TOO_SHORT: "Question must be at least 10 characters.",
    INVALID_TYPE: "Invalid question type.",
    LESSON_ID_REQUIRED: "Lesson ID is required.",
  },


   CONCERN: {
    MESSAGE_REQUIRED: "Message is required and must be a non-empty string.",
    COURSE_ID_REQUIRED: "Course ID is required.",
    MENTOR_ID_REQUIRED: "Mentor ID is required.",
    ATTACHMENTS_INVALID: "Attachments must be an array.",
    ATTACHMENT_INVALID:
      "Each attachment must include url, filename, size, and valid type (image/audio).",
  },
};
