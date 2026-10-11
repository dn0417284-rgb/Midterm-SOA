
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
  // Mã sinh viên - bắt buộc
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mã sinh viên.' })
  @MaxLength(20, {
    message: 'Mã sinh viên không được quá 20 ký tự.',
  })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Mã sinh viên chỉ được chứa chữ cái và chữ số.',
  })
  MSV: string;

  // Họ và tên - bắt buộc
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên.' })
  @MaxLength(100, {
    message: 'Họ và tên không được quá 100 ký tự.',
  })
  TENSV: string;

  // Khoa - không bắt buộc
  @IsOptional()
  @IsString({
    message: 'Khoa phải là chuỗi ký tự.',
  })
  @MaxLength(100, {
    message: 'Tên khoa không được quá 100 ký tự.',
  })
  KHOA?: string | null;

  // Điểm trung bình - không bắt buộc
  @IsOptional()
  @IsNumber({}, {
    message: 'Điểm trung bình phải là số.',
  })
  @Min(0, {
    message: 'Điểm trung bình không được nhỏ hơn 0.',
  })
  @Max(10, {
    message: 'Điểm trung bình không được lớn hơn 10.',
  })
  DIEMTB?: number | null;

  // Lớp - không bắt buộc
  @IsOptional()
  @IsString({
    message: 'Lớp phải là chuỗi ký tự.',
  })
  @MaxLength(50, {
    message: 'Tên lớp không được quá 50 ký tự.',
  })
  LOP?: string | null;

  // Email - không bắt buộc theo DTO hiện tại
  @IsOptional()
  @IsEmail({}, {
    message: 'Email không đúng định dạng.',
  })
  @MaxLength(100, {
    message: 'Email không được quá 100 ký tự.',
  })
  EMAIL?: string | null;

  // Mật khẩu - không bắt buộc theo DTO hiện tại
  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự.',
  })
  @MaxLength(100, {
    message: 'Mật khẩu không được quá 100 ký tự.',
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
  MATKHAU?: string | null;
}
