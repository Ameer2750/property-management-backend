import { IsEnum, IsOptional, IsString, IsEmail, Length } from 'class-validator';
import { roleEnum } from '../../../drizzle/schema'; // Adjust path as needed

export class CreateUserDto {
  @IsString()
  @Length(1, 255) // Ensure username length is between 1 and 255
  username: string;

  @IsEmail()
  @Length(1, 255) // Ensure email length is between 1 and 255
  email: string;

  @IsOptional()
  @IsString()
  @Length(0, 20) // Optional phone number with max length of 20
  phone?: string;

  @IsEnum(roleEnum)
  role: typeof roleEnum;
}
