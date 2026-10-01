import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  isLoading = false;
  errorMessage = '';

  showPassword = false;
  rememberMe = true;

  loginForm = this.fb.nonNullable.group({
    EMAIL: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],

    MATKHAU: [
      '',
      [
        Validators.required,
      ],
    ],
  });

  onSubmit(): void {
    this.errorMessage = '';

    // Hiện lỗi validation ngay khi bấm Đăng nhập
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    const formValue = this.loginForm.getRawValue();

    this.auth
      .login({
        EMAIL: formValue.EMAIL.trim(),
        MATKHAU: formValue.MATKHAU,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          this.auth.saveSession(response);

          if (response.user.VAITRO === 'ADMIN') {
            this.router.navigate([
              '/dashboard/admin',
            ]);
          } else {
            this.router.navigate([
              '/dashboard/student',
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