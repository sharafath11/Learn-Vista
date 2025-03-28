type userRole="user"|"mentor"
export interface IUserRegistration{
    name: string,
    email: string,
    role:userRole,
    password: string,
    confirmPassword:string
}