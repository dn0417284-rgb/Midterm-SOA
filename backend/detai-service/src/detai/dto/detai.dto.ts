// Format tạo đề tài
export class CreateDetaiDto {
  tenDetai: string;
  moTa: string;
  giangVienHuongDan: string;
  trangThai?: number;
}

// Format cập nhật đề tài (giữ các thông tin không thay đổi)
export class UpdateDetaiDto {
  tenDetai?: string;
  giangVienHuongDan?: string;
  moTa?: string;
  trangThai?: number;
}
