import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  email = '';
  password = '';
  remember = true;

  isLoading = false;
  errorMessage = '';

  onLogin(event: Event): void {
    event.preventDefault();

    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage =
        'Vui lòng nhập đầy đủ email và mật khẩu.';
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

          // Lưu JWT + thông tin người dùng
          this.auth.saveSession(response);

          // Điều hướng theo vai trò
          if (response.user.VAITRO === 'ADMIN') {
            this.router.navigate([
              '/admin/dashboard',
            ]);
          } else {
            this.router.navigate([
              '/student/dashboard',
            ]);
          }
        },

        error: (error) => {
          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ??
            'Email hoặc mật khẩu không chính xác.';
        },
      });
  }
}