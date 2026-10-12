import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  MSV = '';
  TENSV = '';
  EMAIL = '';
  MATKHAU = '';
  XAC_NHAN_MAT_KHAU = '';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  onRegister(event: Event): void {
    event.preventDefault();

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.MSV.trim() ||
      !this.TENSV.trim() ||
      !this.EMAIL.trim() ||
      !this.MATKHAU ||
      !this.XAC_NHAN_MAT_KHAU
    ) {
      this.errorMessage =
        'Vui lòng nhập đầy đủ thông tin.';
      return;
    }

    if (!/^\d+$/.test(this.MSV.trim())) {
      this.errorMessage =
        'Mã sinh viên chỉ được chứa chữ số.';
      return;
    }

    if (this.MATKHAU !== this.XAC_NHAN_MAT_KHAU) {
      this.errorMessage =
        'Mật khẩu xác nhận không khớp.';
      return;
    }

    this.isLoading = true;

    this.auth
      .register({
        MSV: this.MSV.trim(),
        TENSV: this.TENSV.trim(),
        EMAIL: this.EMAIL.trim(),
        MATKHAU: this.MATKHAU,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage =
            response.message;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },

        error: (error) => {
          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ??
            'Đăng ký thất bại. Vui lòng thử lại.';
        },
      });
  }
}