export interface IMentorProfileService{
    editProfile(username:string,bio:string,imageBuffer:Buffer|undefined,id:string):Promise<{username:string,image:string}>
}