
import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateSinhVienDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  KHOA?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  LOP?: string | null;
}
