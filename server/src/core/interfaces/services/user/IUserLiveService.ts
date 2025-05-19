export interface IUserLiveService {
  getRoomIdService(courseId:string,userId:string):Promise<string>
}