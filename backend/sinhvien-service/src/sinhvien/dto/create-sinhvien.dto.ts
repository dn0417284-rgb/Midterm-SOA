import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateSinhVienDto {
  @IsString()
  @IsNotEmpty()
  MSV: string;

  @IsString()
  @IsNotEmpty()
  TENSV: string;

  @IsString()
  @IsNotEmpty()
  KHOA: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  DIEMTB?: number | null;

  @IsString()
  @IsNotEmpty()
  LOP: string;

  @IsOptional()
  @IsEmail()
  EMAIL?: string | null;

  @IsOptional()
  @IsString()
  MATKHAU?: string | null;
}