
import { IsOptional, IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { RoleEnum } from '../../../drizzle/schema'; // Adjust path as needed

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}
