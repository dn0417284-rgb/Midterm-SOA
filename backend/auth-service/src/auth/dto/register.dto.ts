import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: 'Mã sinh viên chỉ được chứa chữ số',
  })
  MSV: string;

  @IsString()
  @IsNotEmpty()
  TENSV: string;

  @IsEmail()
  EMAIL: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message:
      'Mật khẩu phải có ít nhất 8 ký tự',
  })
  @Matches(/[A-Z]/, {
    message:
      'Mật khẩu phải có ít nhất 1 chữ hoa',
  })
  @Matches(/[a-z]/, {
    message:
      'Mật khẩu phải có ít nhất 1 chữ thường',
  })
  @Matches(/[0-9]/, {
    message:
      'Mật khẩu phải có ít nhất 1 chữ số',
  })
  @Matches(/[^A-Za-z0-9]/, {
    message:
      'Mật khẩu phải có ít nhất 1 ký tự đặc biệt',
  })
  MATKHAU: string;
}