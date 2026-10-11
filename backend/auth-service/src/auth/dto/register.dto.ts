
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  // Mã sinh viên: cho phép chữ cái và chữ số
  @IsString()
  @IsNotEmpty({
    message: 'Vui lòng nhập mã sinh viên.',
  })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message:
      'Mã sinh viên chỉ được chứa chữ cái và chữ số.',
  })
  MSV: string;

  // Họ và tên
  @IsString()
  @IsNotEmpty({
    message: 'Vui lòng nhập họ và tên.',
  })
  TENSV: string;

  // Email
  @IsEmail({}, {
    message: 'Email không đúng định dạng.',
  })
  @IsNotEmpty({
    message: 'Vui lòng nhập email.',
  })
  EMAIL: string;

  // Mật khẩu
  @IsString()
  @IsNotEmpty({
    message: 'Vui lòng nhập mật khẩu.',
  })
  @MinLength(8, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự.',
  })
  @Matches(/[A-Z]/, {
    message: 'Mật khẩu phải có ít nhất 1 chữ hoa.',
  })
  @Matches(/[a-z]/, {
    message: 'Mật khẩu phải có ít nhất 1 chữ thường.',
  })
  @Matches(/[0-9]/, {
    message: 'Mật khẩu phải có ít nhất 1 chữ số.',
  })
  @Matches(/[^A-Za-z0-9\s]/, {
    message: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt.',
  })
  MATKHAU: string;
}
