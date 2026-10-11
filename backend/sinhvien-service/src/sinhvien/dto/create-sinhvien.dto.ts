
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateSinhVienDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mã sinh viên.' })
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Mã sinh viên chỉ được chứa chữ cái và chữ số.',
  })
  MSV: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên.' })
  @MaxLength(100)
  TENSV: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập khoa.' })
  @MaxLength(100)
  KHOA: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  DIEMTB?: number | null;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập lớp.' })
  @MaxLength(50)
  LOP: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @MaxLength(100)
  EMAIL?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự.',
  })
  @MaxLength(100)
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
  MATKHAU?: string | null;
}
