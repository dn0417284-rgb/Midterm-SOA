import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  remember = true;

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  private getErrorMessage(error: any): string {
    const status = error?.status;
    const message = error?.error?.message;
    const rawMessage = Array.isArray(message)
      ? message.join(' ')
      : typeof message === 'string'
        ? message
        : '';

    if (status === 0) {
      return 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
    }

    if (status === 401 || status === 400) {
      return 'Email hoặc mật khẩu không chính xác.';
    }

    if (status === 403) {
      return 'Tài khoản của bạn không có quyền truy cập.';
    }

    if (status >= 500) {
      return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
    }

    return rawMessage || 'Đăng nhập thất bại. Vui lòng thử lại.';
  }

  onLogin(event: Event): void {
    event.preventDefault();

    if (this.isLoading) return;

    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ email và mật khẩu.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
      this.errorMessage = 'Email không đúng định dạng.';
      return;
    }

    this.isLoading = true;

    this.auth
      .login({
        EMAIL: this.email.trim(),
        MATKHAU: this.password,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.auth.saveSession(response);

          this.router.navigate([
            response.user.VAITRO === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard',
          ]);
        },

        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);

          this.cdr.detectChanges();
        },
      });
  }
}
