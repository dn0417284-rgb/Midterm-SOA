import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css',
})
export class StudentProfile {

  user: any = null;

  isEditing = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  editEmail = '';
  editClass = '';
  editFaculty = '';

  constructor(
    private readonly auth: Auth,
  ) {}

  // ============================
  // KHỞI TẠO
  // ============================

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.syncEditData();
  }

  // ============================
  // THÔNG TIN SINH VIÊN
  // ============================

  get studentName(): string {
    return this.user?.TENSV || '';
  }

  get studentCode(): string {
    return this.user?.MSV || '';
  }

  get studentEmail(): string {
    return this.user?.EMAIL || '';
  }

  get studentClass(): string {
    return this.user?.LOP || '';
  }

  get studentFaculty(): string {
    return this.user?.KHOA || '';
  }

  // ============================
  // AVATAR
  // ============================

  get studentAvatar(): string {

    const name = this.studentName.trim();

    if (!name) {
      return '';
    }

    const words = name.split(/\s+/);

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  // ============================
  // ĐỒNG BỘ FORM
  // ============================

  private syncEditData(): void {

    this.editEmail = this.studentEmail;
    this.editClass = this.studentClass;
    this.editFaculty = this.studentFaculty;
  }

  // ============================
  // CHỈNH SỬA
  // ============================

  startEditing(): void {

    this.isEditing = true;

    this.errorMessage = '';
    this.successMessage = '';

    this.syncEditData();
  }

  // ============================
  // KIỂM TRA THAY ĐỔI
  // ============================

  get hasChanges(): boolean {

    return (
      this.editEmail.trim() !== this.studentEmail.trim() ||
      this.editClass.trim() !== this.studentClass.trim() ||
      this.editFaculty.trim() !== this.studentFaculty.trim()
    );
  }

  // ============================
  // HỦY
  // ============================

  cancelEditing(): void {

    this.isEditing = false;

    this.errorMessage = '';
    this.successMessage = '';

    this.syncEditData();
  }

  // ============================
  // LƯU THÔNG TIN
  // ============================

  saveChanges(): void {

    if (this.isSaving) {
      return;
    }

    if (!this.hasChanges) {
      return;
    }

    if (!this.studentCode) {
      this.errorMessage =
        'Không xác định được mã sinh viên.';
      return;
    }

    if (!this.editEmail.trim()) {
      this.errorMessage =
        'Email không được để trống.';
      return;
    }

    // ============================
    // DỮ LIỆU MỚI
    // ============================

    const newData = {
      EMAIL: this.editEmail.trim(),
      KHOA: this.editFaculty.trim(),
      LOP: this.editClass.trim(),
    };

    // ============================
    // LƯU DỮ LIỆU CŨ
    // ĐỂ ROLLBACK NẾU API LỖI
    // ============================

    const oldUser = {
      ...this.user,
    };

    // ============================
    // CẬP NHẬT GIAO DIỆN NGAY
    // ============================

    this.user = {
      ...this.user,

      EMAIL: newData.EMAIL,
      KHOA: newData.KHOA,
      LOP: newData.LOP,
    };

    // Cập nhật localStorage ngay
    localStorage.setItem(
      'user',
      JSON.stringify(this.user),
    );

    // Đồng bộ form
    this.syncEditData();

    // Thoát chế độ chỉnh sửa ngay
    this.isEditing = false;

    // Hiện trạng thái lưu
    this.isSaving = true;

    this.errorMessage = '';
    this.successMessage = '';

    // ============================
    // GỌI BACKEND
    // ============================

    this.auth
      .updateProfile(
        this.studentCode,
        newData,
      )
      .subscribe({

        // ============================
        // BACKEND LƯU THÀNH CÔNG
        // ============================

        next: () => {

          this.isSaving = false;

          this.successMessage =
            'Cập nhật thông tin thành công.';

          console.log(
            'Cập nhật thành công:',
            newData,
          );
        },

        // ============================
        // BACKEND LỖI
        // ============================

        error: (error) => {

          console.error(
            'Lỗi cập nhật:',
            error,
          );

          // Khôi phục dữ liệu cũ
          this.user = oldUser;

          localStorage.setItem(
            'user',
            JSON.stringify(this.user),
          );

          this.syncEditData();

          this.isEditing = true;
          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            'Không thể cập nhật thông tin.';
        },
      });
  }
}
