export interface IMentorProfileService{
    editProfile(username: string, bio: string, imageBuffer: Buffer | undefined,expertise:string[], id: string): Promise<{ username: string, image: string }>
    changePassword(mentorId:string,passowrd:string,newPassword:string):Promise<void>
}