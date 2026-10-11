import { IsInt } from 'class-validator';
export class CreateDangKyDto {
  @IsInt() detaiId: number;
}