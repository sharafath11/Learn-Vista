export const Messages = {
  VOICE_NOTE: {
  SAVED: "Voice note saved successfully.",
  FETCHED: "Voice notes fetched successfully.",
  UPDATED: "Voice note updated successfully.",
  DELETED: "Voice note deleted successfully.",
  NOT_FOUND: "Voice note not found.",
  INVALID_ID: "Invalid voice note ID.",
  MISSING_NOTE: "Voice note content is required.",
  SAVE_FAILED: "Failed to save voice note.",
  FETCH_FAILED: "Failed to fetch voice notes.",
  UPDATE_FAILED: "Failed to update voice note.",
  DELETE_FAILED: "Failed to delete voice note.",
},

  AUTH: {
    LOGIN_SUCCESS: "Login successful.",
    LOGOUT_SUCCESS: "Logout successful.",
    MISSING_CREDENTIALS: "Email and password are required.",
    EMAIL_REQUIRED: "Email is required.",
    VERIFICATION_SUCCESS: "Verification successful.",
    OTP_SENT: "OTP sent successfully.",
    FORGOT_PASSWORD_SUCCESS: "Password reset email sent if account exists.",
    AUTH_REQUIRED: "Authentication required.",

    PASSWORD_RESET_SUCCESS: "Password reset successfully.",
    CHANGE_PASSWORD: "Password changed successfully.",
    WEAK_PASSWORD:
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    INVALID_TOKEN: "Invalid or expired token.",
    REGISTRATION_SUCCESS: "User registration successful.",
    GOOGLE_AUTH_SUCCESS: "Google authentication successful.",
    MISSING_EMAIL: "Email is required.",
    MISSING_EMAIL_OTP: "Email and OTP are required.",
    MISSING_LOGIN_DATA: "Provide email/password or Google ID.",
    MISSING_BODY: "Request body is missing.",
    BLOCKED: "Access denied. Your account has been blocked.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    OTP_ALREADY_SENT: "OTP already sent.",
    INVALID_OTP: "Invalid OTP.",
    RESET_EMAIL_FAILED: "Failed to send reset email. Try again later.",
    NOT_FOUND: "Mentor not found.",
    STATUS_PENDING: (status: string) => `This user is ${status}`,
    PLEASE_SIGNUP: "Please signup.",
    APPLY_FIRST: "Please apply to be a mentor.",
    ALREADY_REGISTERED: "This mentor is already registered.",
    CHANGE_PASSWORD_NOT_VERIFIED:
      "Please Register then you can change password.",
    PASSWORD_RESET_TITLE: "Password Reset",
    PASSWORD_RESET_MESSAGE: "Your password has been reset.",

    MISSING_CREDENTIALS_EMAIL_PASSWORD: "Email and password are required.",
    OTP_EXPIRED: "OTP Expired.",
    EMAIL_ALREADY_REGISTERED: "This email is already registered.",
    USER_ALREADY_EXISTS: "User already exists.",
    INVALID_GOOGLE_CREDENTIALS: "Invalid Google credentials.",
    INVALID_GOOGLE_PROFILE: "Invalid Google profile data.",
    PASSWORD_NOT_SET: "Password not set for this account.",
    USER_UPDATE_FAILED: "User creation/update failed.",
    MUST_HAVE_UPPERCASE:
      "New password must contain at least one uppercase letter.",
    MUST_HAVE_NUMBER: "New password must contain at least one number.",
    INVALID_CURRENT: "Invalid current password.",
    EMAIL_FAILED: "Failed to send reset email. Try again later.",
  },
  USERS: {
    FETCHED: "Users fetched successfully.",
    BLOCK_STATUS_UPDATED: "User status updated successfully.",
    MISSING_BLOCK_DATA: "User ID and valid status (boolean) are required.",
    MISSING_USER_ID: "User ID is required.",
    MISSING_TOKEN_PASSWORD: "Token and password are required.",
    USER_NOT_FOUND: "User not found.",
    FETCHED_SUCCESSFULLY: "User retrieved successfully.",
    INVALID_QUESTION_NUMBER: "Invalid question number.",
    DAILY_TASKS_GENERATED: "Daily tasks generated.",
    TASK_UPDATED: "Task updated.",
    ALL_DAILY_TASKS_FETCHED: "Fetched all daily tasks.",

    BLOCK_STATUS_UPDATED_NOT: (status: boolean) =>
      `User ${status ? "Blocked" : "Unblocked"} successfully.`,

    FETCH_FAILED: "Error fetching users.",
    BLOCK_TITLE: (status: boolean) =>
      `Account ${status ? "Blocked" : "Unblocked"}`,
    BLOCK_MESSAGE: (status: boolean) =>
      `Your account has been ${status ? "blocked" : "unblocked"} by the admin.`,
    NEW_MENTOR_APPLICATION: {
      TITLE: "New Mentor Application",
      getMessage: (username: string) =>
        `${username} has applied to become a mentor.`,
    },
  },
  CERTIFICATES: {
    FETCHED: "Certificates fetched successfully.",
    REVOKED: "Certificate revoked successfully.",
    UNREVOKED: "Certificate unrevoked successfully.",
    MISSING_DATA: "Certificate ID and revocation status are required.",
    CERTIFICATE_NOT_FOUND: "Certificate not found.",
    INVALID_STATUS: (status: string) =>
      `Invalid status '${status}' provided. Defaulting to 'all'.`,
  },
  CATEGORY: {
    CREATED: "Category added successfully.",
    UPDATED: "Category updated successfully.",
    FETCHED: "Categories fetched successfully.",
    RETRIEVED: "Categories retrieved successfully.",
    STATUS_UPDATED: "Category status updated successfully.",
    MISSING_FIELDS: "Missing required category fields.",
    VALIDATION_ERROR: "Category validation failed.",
    ALREADY_EXISTS: "This category already exists",
    FAILED_TO_FETCH: "Failed to fetch categories",
    INVALID_INPUT: "Invalid input parameters",
    NOT_FOUND: "Category not found",
    FAILED_TO_UPDATE: "Failed to update category",
    FAILED_TO_UPDATE_STATUS: "Failed to update category status",
  },
  CONCERN: {
    // Core concern messages
    UNRESOLVED_EXISTS:
      "You already have an unresolved concern. Please resolve it before creating a new one.",
    FETCHED: "Concerns fetched successfully.",
    STATUS_UPDATED: "Concern status updated successfully.",
    INVALID_STATUS: "Invalid concern status provided.",
    INVALID_RESOLUTION: "Resolution must be at least 10 characters.",
    FETCH_FAILED: "Failed to fetch concerns.",
    NOT_FOUND: "Concern not found.",
    STATUS_UPDATE_FAILED: "Failed to update concern status.",
    UPDATE_FAILED: "Failed to update concern.",
    RAISED: "Concern raised successfully.",
    INVALID_PAYLOAD: "Invalid concern payload.",
    STATUS_UPDATEDWITHNOT: (status: string) =>
      `Concern status changed to ${status}.`,
    RESOLVED_NOTIFICATION: (title: string) =>
      `Your concern "${title}" has been resolved by the admin.`,
    IN_PROGRESS_NOTIFICATION: (title: string) =>
      `Your concern "${title}" has been marked as in-progress by the admin.`,
    ATTACHMENT_UPLOAD_FAILED: (filename: string) =>
      `Failed to upload attachment ${filename}.`,
    NOTIFICATION: {
      TITLE: "New Concern Raised",
      MESSAGE: (courseTitle: string) =>
        `A new concern has been raised for course ${courseTitle}.`,
    },
  },
  COURSE: {
    CREATED: "Course created successfully.",
    UPDATED: "Course edited successfully.",
    STATUS_UPDATED: "Course status updated successfully.",
    RETRIEVED: "Courses retrieved successfully.",
    FETCHED: "Course fetched successfully.",
    LESSONS_FETCHED: "Lessons fetched successfully.",
    MISSING_ID: "Missing courseId.",
    THUMBNAIL_REQUIRED: "Thumbnail image is required.",
    PUBLISHED: "Course published successfully.",
    UPDATED_WITH_USER: "Course updated with user successfully.",
    PROGRESS_FETCHED: "Progress fetched successfully.",
    FAILED_TO_CREATE: "Failed to create course.",
    NOT_FOUND: "Course not found.",
    FAILED_TO_UPDATE: "Failed to update course.",
    FAILED_TO_UPDATE_STATUS: "Failed to update course status.",
    NOT_IN_ENROLLMENT_LIST: "User not listed in course enrollment",
    INVALID_ID: "Invalid course ID.",
    NO_MENTOR: "No mentor associated with this course.",
    MENTOR_ID_REQUIRED: "Mentor ID is required.",
    MISSING_DATETIME: "Missing date/time range.",
    INCOMPLETE_SCHEDULE: "Incomplete scheduling data.",
    MENTOR_COURSE_CONFLICT: "Mentor already has a course at this time.",
    MENTOR_TIME_CONFLICT:
      "This mentor already has a class during this time range.",
    FETCH_FAILED: "Failed to fetch courses.",

    // Notification messages
    SCHEDULED_NOTIFICATION: (title: string, time: string) =>
      `Course "${title}" is scheduled to start at ${time}.`,
    UPDATED_NOTIFICATION: (title: string) =>
      `Your course "${title}" has been updated by the admin.`,
    BLOCKED_NOTIFICATION: (title: string) =>
      `Your ${title} course has been blocked by the admin.`,
    UNBLOCKED_NOTIFICATION: (title: string) =>
      `Your ${title} course has been unblocked by the admin.`,
    STATUS_TEXT: (isBlock: boolean) => (isBlock ? "blocked" : "unblocked"),
    COMPLETED: {
      TITLE: "Course Completed!",
      MESSAGE: (username: string, courseTitle: string) =>
        `User ${username} has completed the course "${courseTitle}" and received a certificate.`,
    },
    PUBLISHED_NOTIFICATION: (title: string) =>
      `The course "${title}" is now available. Start learning today!`,
    NOT_ENROLLED: "User is not enrolled in this course",
  },
  COMMON: {
    INTERNAL_ERROR: "Something went wrong. Please try again later.",
    MISSING_FIELDS: "Required fields are missing.",
    UNAUTHORIZED: "Unauthorized access.",
    ACCESS_DENIED:
      "Access denied. You do not have permission to perform this action.",
    INVALID_REQUEST: "Invalid request.",
  },
  MENTOR: {
    CREATED: "Mentor created successfully.",
    FETCHED: "Mentor fetched successfully.",
    NOT_FOUND: "Mentor not found.",
    ID_REQUIRED: "Mentor ID is required.",
    STATUS_UPDATED: (status: string) => `Mentor status changed to ${status}`,
    BLOCK_UPDATED: (name: string, isBlocked: boolean) =>
      `${name} ${isBlocked ? "Blocked" : "Unblocked"} successfully`,
    BLOCK_FAILED: "Something went wrong while updating mentor status.",
    CHANGE_STATUS_MISSING: "mentorId, status, and email are required.",
    FETCH_FAILED: "Error fetching mentors.",
    STATUS_CHANGE_FAILED: (id: string) =>
      `Error changing mentor status for ID ${id}`,
    STATUS_APPROVED: "approved",
    STATUS_REJECTED: "rejected",
    APPROVED_TITLE: "🎉 You're approved as a mentor!",
    APPROVED_MESSAGE:
      "Congratulations! Your mentor profile has been approved. You can now sign up and complete your onboarding on the Mentor Page.",
    REJECTED_TITLE: "⚠️ Your mentor request was rejected",
    REJECTED_MESSAGE:
      "We're sorry to inform you that your mentor request was rejected by the admin.",
    BLOCK_TOGGLE_FAILED: (id: string) =>
      `Error toggling block status for mentor ${id}`,
    BLOCK_STATUS_TEXT: (isBlock: boolean) =>
      isBlock ? "blocked" : "unblocked",
    BLOCK_TITLE: (statusText: string) => `Your account was ${statusText}.`,
    BLOCK_MESSAGE: (statusText: string) =>
      `Your mentor account has been ${statusText} by the admin.`,
    APPLICATION_ALREADY_EXISTS:
      "A mentor application has already been submitted for this email.",
    USER_ALREADY_APPLIED: "You have already submitted a mentor application.",
    APPLICATION_SUBMITTED: "Mentor application submitted successfully.",
    APPROVAL_SUCCESS: "Mentor approved successfully.",
    REJECTION_SUCCESS: "Mentor application rejected successfully.",
  },
  LESSONS: {
    FETCHED: "Lessons successfully fetched.",
    FETCHED_SUCCESSFULLY: "Lesson details successfully fetched.",
    ADDED: "Lesson successfully added.",
    UPDATED: "Lesson successfully updated.",
    CREATE_FAILED: "Failed to add lesson.",
    UPDATE_FAILED: "Failed to update lesson or lesson not found.",
    NOT_FOUND: "Lesson not found.",
    ORDER_NOT_UNIQUE: "Lesson order must be unique within the course.",
    VIDEO_URL_SIGNED: "Signed video upload URL generated successfully.",
    SIGNED_URL_GENERATED: "Signed video access URL generated successfully.",
    UPLOAD_URL_FAILED: "Failed to generate upload URL.",
    UPLOAD_FAILED: "Failed to upload thumbnail to S3.",
    THUMBNAIL_UPDATE_FAILED: "Failed to update thumbnail.",
    FILE_DELETED: "File deleted successfully.",
    AWS_CONFIG_ERROR: "Server error: Missing AWS credentials or bucket name.",
    MISSING_FIELDS: "Missing required fields: title, video URL, and course ID.",
    INVALID_ID: "Lesson ID is required for update.",
    REPORT_SUBMITTED: "Report submitted successfully.",
    COMMENT_ADDED: "Comment added successfully.",
    PROGRESS_UPDATED: "Lesson progress updated successfully.",
    INVALID_VIDEO_DURATION: "Invalid value for videoTotalDuration.",
    INVALID_VIDEO_WATCHED_DURATION: "Invalid value for videoWatchedDuration.",
    VIDEO_TOTAL_DURATION_REQUIRED:
      "videoTotalDuration is required to update video progress.",
    REPORT_ALREADY_EXISTS:
      "You already have a report for this lesson. Please check the report section.",
    REPORT_GENERATION_FAILED:
      "Failed to generate report from AI service. Please try again.",
    PROGRESS_UPDATE_FAILED: "Failed to finalize lesson progress update.",
    NO_LESSONS_FOUND: "No lessons found for this course",
    INVALID_DATA: "Invalid data provided",
  },
  QUESTIONS: {
    FETCHED: "Questions fetched successfully.",
    ADDED: "Question added successfully.",
    UPDATED: "Question updated successfully.",
    GENERATE_OPTIONS_SUCCESS: "Options generated successfully.",
    GENERATE_OPTIONS_FAILED: "Failed to generate options.",
    INVALID_QUESTION: "Question must be at least 10 characters long.",
    INVALID_TYPE: "Invalid question type. Must be 'theory' or 'practical'.",
    MISSING_OPTIONS:
      "At least 2 options must be provided for practical questions.",
    MISSING_CORRECT_OPTION: "Correct option index is missing or invalid.",
    INVALID_GENERATION_INPUT: "Question is required to generate options.",
    NOT_FOUND: "Questions not found for this lesson.",
    INSUFFICIENT_OPTIONS:
      "Insufficient options generated. Try a more descriptive question.",
    INVALID_QUESTION_ID: "Question ID is required.",
  },
  COMMENT: {
    FETCHED: "Comments fetched successfully.",
    MISSING_MENTOR: "Mentor authentication failed.",
    INVALID_COURSE: "Invalid course ID provided.",
    MISSING_MENTOR_ID: "Mentor ID is required to fetch comments.",
    FETCH_FAILED: "Failed to fetch comments.",
    NO_COMMENTS_FOUND: "No comments found for the given criteria.",
  },
  DONATION: {
    FETCHED: "Donations fetched successfully.",
    FILTERED_FETCHED: "Filtered donations fetched successfully.",
    INVALID_AMOUNT:
      "Invalid amount provided. Amount must be a positive number.",
    INVALID_CURRENCY:
      "Invalid currency provided. Currency must be a 3-letter code.",
    CHECKOUT_SESSION_CREATED: "Checkout session created successfully.",
    MISSING_SESSION_ID: "Missing session_id.",
    VERIFIED: "Donation verified.",
    INVALID_PAGE: "Invalid page number.",
    FETCH_FAILED: "Failed to fetch donations.",
    FILTERED_FETCHLED: "Filtered donations fetched successfully.",
    FILTERED_FETCH_FAILED: "Failed to fetch filtered donations.",
    COUNT_FAILED: "Failed to count filtered donations.",
    SUCCESS_TITLE: "Donation Successful",
    SUCCESS_MESSAGE: (amount: number ,name:string) => `${name} donated ₹${amount}. Thank you!`,
    MISSING_CHARGE_ID: "Could not determine charge ID.",
  },
  GENAI: {
    GENERATE_OPTIONS_SUCCESS: "Options generated successfully using Gemini.",
    GENERATE_OPTIONS_FAILED: "Failed to generate options using Gemini.",
    PROMPT_INVALID: "Provided question is invalid or incomplete for Gemini.",
    INVALID_RESPONSE_FORMAT: "Invalid AI response format.",
    PARSING_FAILED: "Failed to parse AI-generated response.",
  },
  STREAM: {
    START_SUCCESS: "Live session started successfully.",
    END_SUCCESS: (coursename?:string)=>`${coursename} Live session ended successfully.`,
    JOINED_SUCCESS: "User joined the session successfully.",
    MISSING_STREAM_DATA: "Missing course ID or token.",
    MISSING_LIVE_ID: "Missing live session ID or token.",
    INVALID_USER: "Invalid user.",
    USER_JOINED_NOTIFICATION_TITLE: "New User Joined",
    USER_JOINED_NOTIFICATION_MESSAGE: (username: string) =>
      `${username} has joined the live session.`,
    NOT_AVAILABLE: "Live session is not available.",
    NOT_STARTED: "This live session has not started yet.",
    ALREADY_ENDED: "This live session has already ended.",
    NOT_ALLOWED:"You Are not allowed on this course please enroll first"
  },
  STUDENTS: {
    FETCHED: "Student data fetched successfully.",
    STATUS_UPDATED_BLOCKED: "Student Blocked successfully.",
    STATUS_UPDATED_UNBLOCKED: "Student Unblocked successfully.",
    INVALID_REQUEST: "Invalid request.",
    COURSE_ACCESS_STATUS_NOTIFICATION: (
      courseTitle: string,
      statusText: string
    ) =>
      `Your access to the course "${courseTitle}" has been ${statusText} by the mentor.`,
  },
  NOTIFICATIONS: {
    CREATED: "Notification created successfully.",
    FETCHED: "Notifications fetched successfully.",
    MARKED_AS_READ: "Notification marked as read.",
    MARKED_ALL_AS_READ: (count: number) =>
      `Marked ${count} notifications as read.`,
  },
  SHARED: {
    KEY_NOT_FOUND: "Key not found.",
    SIGNED_URL_FETCHED: "Signed URL fetched successfully.",
    INVALID_TOKEN: "Invalid refresh token.",
    TOKENS_REFRESHED: "Tokens refreshed successfully.",
    AI_RESPONSE_FETCHED: "AI response fetched successfully.",
  },
  PROFILE: {
    PASSWORD: {
      CHANGED: {
        TITLE: "🔐 Password Changed",
        MESSAGE: "Your password was changed successfully.",
      },
    },
    NO_FILE_UPLOADED: "No file uploaded.",
    INVALID_EXPERTISE_FORMAT: "Invalid expertise format.",
    INVALID_SOCIAL_LINKS_FORMAT: "Invalid socialLinks format.",
    APPLICATION_SUBMITTED: "Application submitted successfully.",
    USERNAME_TOO_SHORT: "Username must be at least 6 characters long.",
    PROFILE_UPDATED: "Profile updated successfully.",
    USER_NOT_FOUND: "User not found.",
    DELETE_IMAGE_FAILED: "Failed to delete old profile picture",
    PASSWORD_UPPERCASE:
      "New password must contain at least one uppercase letter",
    PASSWORD_NUMBER: "New password must contain at least one number",
    INVALID_CURRENT_PASSWORD: "Invalid current password",
    PASSWORD_CHANGE_TITLE: "Password was changed",
    PASSWORD_CHANGE_MESSAGE: "Your password has been changed.",
  },
  CONFIG: {
    ADMIN_ID_MISSING: "Admin ID is not configured.",
    AWS_CREDENTIALS_MISSING:
      "AWS credentials or bucket name is not configured.",
    ENV_VARIABLE_MISSING: (variable: string) =>
      `${variable} environment variable is missing.`,
    RUN:(port:number|string)=>`Server running on ${port}`
  },
  RESUME: {
    UPLOAD_FAILED: "Failed to upload or process resume. Please try again.",
    INVALID_FORMAT:
      "Unsupported resume format. Please upload a PDF or DOCX file.",
    MISSING_FILE: "No resume file provided.",
    PARSE_ERROR: "Failed to extract data from resume.",
  },
  DAILY_TASK: {
    GENERATION_FAILED: "Failed to generate or parse the daily task.",
    NEW_TASK_TITLE: "New Daily Task",
    NEW_TASK_MESSAGE: (day: number) => `Your Day ${day} task is ready!`,
    TASK_NOT_FOUND: "Task not Found",
    AUDIO_FILE_REQUIRE: "Audio file is required",
    ANSWER_REQUIRED:"Answer is required for evaluation"
  },
  REPOSITORY: {
    CREATE_ERROR: "Error creating document",
    COUNT_ERROR: "Error counting documents",
    FIND_ALL_ERROR: "Error fetching documents",
    FIND_PAGINATED_ERROR: "Error fetching paginated documents",
    UPDATE_MANY_ERROR: "Failed to update multiple documents",
    UPDATE_ONE_ERROR: "Error updating document with filter",
    FIND_BY_ID_ERROR: "Error finding document by ID",
    FIND_ONE_ERROR: "Error finding document",
    FIND_WITH_PASSWORD_ERROR: "Error finding document with password",
    UPDATE_ERROR: "Error updating document",
    DELETE_ERROR: "Error deleting document",
  },
  UPLOAD: {
    ONLY_PDF: "Only PDF files are allowed!",
    ONLY_IMAGES: (types: string[]) =>
      `Only image files are allowed (${types.join(", ")})`,
    ONLY_AUDIO: (received: string) =>
      `Only audio files are allowed! Received: ${received}`,
    ONLY_IMAGE_OR_AUDIO: (received: string) =>
      `Only image/audio files allowed. Received: ${received}`,
  },
};
