import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class AdminLoginDto {
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;
}