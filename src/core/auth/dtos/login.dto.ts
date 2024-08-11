import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  password: string;
}
