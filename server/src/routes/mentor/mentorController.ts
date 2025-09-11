import container from "../../core/di/container";
import { IMentorController } from "../../core/interfaces/controllers/mentor/IMentor.controller";
import { IMentorAuthController } from "../../core/interfaces/controllers/mentor/IMentorAuth.controller";
import { IMentorCommentsController } from "../../core/interfaces/controllers/mentor/IMentorComments.controller";
import { IMentorConcernController } from "../../core/interfaces/controllers/mentor/IMentorConcern.controller";
import { IMentorCourseController } from "../../core/interfaces/controllers/mentor/IMentorCourse.controller";
import { IMentorLessonsController } from "../../core/interfaces/controllers/mentor/IMentorLesson.controller";
import { IMentorProfileController } from "../../core/interfaces/controllers/mentor/IMentorProfile.controller";
import { IMentorStreamController } from "../../core/interfaces/controllers/mentor/IMentorStream.controller";
import { IMentorStudentsController } from "../../core/interfaces/controllers/mentor/IMentorStudent.controller";
import { TYPES } from "../../core/types";

export const mentorAuthController = container.get<IMentorAuthController>(TYPES.MentorAuthController);
export const mentorController = container.get<IMentorController>(TYPES.MentorController);
export const mentorProfileController = container.get<IMentorProfileController>(TYPES.MentorProfileController)
export const mentorLessonController=container.get<IMentorLessonsController>(TYPES.MentorLessonsController)
export const mentorStreamController = container.get<IMentorStreamController>(TYPES.MentorStreamController)
export const mentorStudentsController = container.get<IMentorStudentsController>(TYPES.MentorStudentsController)
export const _mentorConcernControler = container.get<IMentorConcernController>(TYPES.mentorConcernController)
export const _mentorCommentController = container.get<IMentorCommentsController>(TYPES.MentorCommentController)
export const _mentorCourseController=container.get<IMentorCourseController>(TYPES.MentorCourseController)