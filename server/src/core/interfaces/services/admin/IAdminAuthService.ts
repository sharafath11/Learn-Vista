export interface IAdminAuthService{
    login(email:string,password:string): { accessToken: string, refreshToken: string }
}