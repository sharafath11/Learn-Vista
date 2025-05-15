export interface IMentorCourseService {
  startLiveSession(courseId:string,mentorId:string):Promise<string>
}