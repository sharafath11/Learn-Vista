export interface IMentorStreamService {
  startStreamSession(courseId: string, mentorId: string): Promise<string>
  endStream(StreamId:string):Promise<void>
}