export interface IUserLiveService {
  getRoomIdService(courseId: string, userId: string): Promise<string>;
  verifyUser(liveId:string,userId:string):Promise<void>
}