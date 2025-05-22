export interface IMentorStreamService {
  startStreamSession(courseId: string, mentorId: string): Promise<string>
  endStream(StreamId:string,mentorId:string):Promise<void>
}