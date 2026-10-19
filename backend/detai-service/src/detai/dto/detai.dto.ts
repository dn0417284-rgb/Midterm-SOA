export class CreateDetaiDto {
  tenDetai: string;
  moTa: string;
  giangVienHuongDan: string;
  trangThai?: number;
}

export class UpdateDetaiDto {
  tenDetai?: string;
  giangVienHuongDan?: string;
  moTa?: string;
  trangThai?: number;
}
