import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  Router,
  RouterLink,
} from '@angular/router';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',

  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],

  templateUrl: './register.html',

  styleUrl: './register.css',
})
export class Register {
  private readonly fb =
    inject(FormBuilder);

  private readonly auth =
    inject(Auth);

  private readonly router =
    inject(Router);


  // =========================
  // TRẠNG THÁI
  // =========================

  isLoading = false;

  errorMessage = '';

  successMessage = '';

  showPassword = false;

  showConfirmPassword = false;


  // =========================
  // GIỚI HẠN SUBMIT
  // =========================

  private submitCount = 0;

  private submitWindowStart =
    Date.now();


  // =========================
  // PASSWORD PATTERN
  // =========================

  private readonly passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;


  // =========================
  // REGISTER FORM
  // =========================

  registerForm =
    this.fb.nonNullable.group({

      // Mã sinh viên:
      // Chỉ cho phép chữ số
      MSV: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
        ],
      ],


      // Họ và tên
      TENSV: [
        '',
        [
          Validators.required,
        ],
      ],


      // Email:
      // Hoàn toàn độc lập với MSV
      //
      // Ví dụ hợp lệ:
      // 4651050332@st.qnu.edu.vn
      // vuong@gmail.com
      // nguyenvuong123@gmail.com
      EMAIL: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],


      // Mật khẩu
      MATKHAU: [
        '',
        [
          Validators.required,
          Validators.pattern(
            this.passwordPattern,
          ),
        ],
      ],


      // Xác nhận mật khẩu
      XAC_NHAN_MAT_KHAU: [
        '',
        [
          Validators.required,
        ],
      ],

    });


  // =========================
  // SUBMIT
  // =========================

  onSubmit(): void {

    // Xóa thông báo cũ
    this.errorMessage = '';

    this.successMessage = '';


    // =========================
    // RESET BỘ ĐẾM SAU 1 PHÚT
    // =========================

    const now = Date.now();

    if (
      now -
        this.submitWindowStart >=
      60_000
    ) {
      this.submitCount = 0;

      this.submitWindowStart = now;
    }


    // =========================
    // GIỚI HẠN 5 LẦN / PHÚT
    // =========================

    if (this.submitCount >= 5) {

      this.errorMessage =
        'Bạn thao tác quá nhiều lần. Vui lòng thử lại sau 1 phút.';

      return;
    }

    this.submitCount++;


    // =========================
    // KIỂM TRA FORM
    // =========================

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }


    // =========================
    // LẤY DỮ LIỆU FORM
    // =========================

    const formValue =
      this.registerForm.getRawValue();


    // =========================
    // KIỂM TRA XÁC NHẬN
    // =========================

    if (
      formValue.MATKHAU !==
      formValue.XAC_NHAN_MAT_KHAU
    ) {

      this.errorMessage =
        'Mật khẩu xác nhận không khớp.';

      return;
    }


    // =========================
    // BẮT ĐẦU ĐĂNG KÝ
    // =========================

    this.isLoading = true;


    this.auth
      .register({

        // MSV chỉ là MSV
        // Không liên quan đến email
        MSV:
          formValue.MSV.trim(),

        // Họ tên
        TENSV:
          formValue.TENSV.trim(),

        // Email hoàn toàn độc lập
        EMAIL:
          formValue.EMAIL.trim(),

        // Mật khẩu
        MATKHAU:
          formValue.MATKHAU,

      })

      .subscribe({

        // =====================
        // THÀNH CÔNG
        // =====================

        next: (response) => {

          this.isLoading = false;

          this.successMessage =
            response.message;


          // Reset form
          this.registerForm.reset();


          // Chuyển sang trang đăng nhập
          setTimeout(() => {

            this.router.navigate([
              '/login',
            ]);

          }, 1000);
        },


        // =====================
        // THẤT BẠI
        // =====================

        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ??
            'Đăng ký thất bại. Vui lòng thử lại.';
        },

      });
  }
}
