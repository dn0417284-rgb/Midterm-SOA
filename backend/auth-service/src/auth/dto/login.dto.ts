import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  EMAIL: string;

  @IsString()
  @IsNotEmpty()
  MATKHAU: string;
}