import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnDestroy {
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);

  private redirectTimer?: ReturnType<typeof setTimeout>;

  MSV = '';
  TENSV = '';
  EMAIL = '';
  MATKHAU = '';
  XAC_NHAN_MAT_KHAU = '';

  agreedToTerms = false;

  showPassword = false;
  showConfirmPassword = false;
  showPasswordGuide = false;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  togglePasswordGuide(): void {
    this.showPasswordGuide = !this.showPasswordGuide;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  get passwordHasMinLength(): boolean {
    return this.MATKHAU.length >= 8;
  }

  get passwordHasLowercase(): boolean {
    return /[a-z]/.test(this.MATKHAU);
  }

  get passwordHasUppercase(): boolean {
    return /[A-Z]/.test(this.MATKHAU);
  }

  get passwordHasNumber(): boolean {
    return /[0-9]/.test(this.MATKHAU);
  }

  get passwordHasSpecialChar(): boolean {
    return /[^a-zA-Z0-9\s]/.test(this.MATKHAU);
  }

  get isPasswordValid(): boolean {
    return (
      this.passwordHasMinLength &&
      this.passwordHasLowercase &&
      this.passwordHasUppercase &&
      this.passwordHasNumber &&
      this.passwordHasSpecialChar
    );
  }

  get isConfirmPasswordValid(): boolean {
    return this.XAC_NHAN_MAT_KHAU.length > 0 && this.MATKHAU === this.XAC_NHAN_MAT_KHAU;
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
      return 'Không thể kết nối đến máy chủ. Vui lòng thử lại.';
    }

    if (
      /(MSV|mã sinh viên)/i.test(rawMessage) &&
      /(number|numeric|digit|chữ số)/i.test(rawMessage)
    ) {
      return 'Máy chủ hiện chỉ chấp nhận mã sinh viên dạng số. Cần cập nhật quy tắc kiểm tra ở backend.';
    }

    if (
      /(password|mật khẩu)/i.test(rawMessage) &&
      /(lowercase|chữ thường|lower case)/i.test(rawMessage)
    ) {
      return 'Máy chủ yêu cầu mật khẩu có ít nhất 1 chữ thường. Vui lòng kiểm tra mật khẩu.';
    }

    if (/(email)/i.test(rawMessage) && /(exist|duplicate|used|tồn tại|sử dụng)/i.test(rawMessage)) {
      return 'Email đã được đăng ký. Vui lòng sử dụng email khác.';
    }

    if (
      /(msv|mã sinh viên)/i.test(rawMessage) &&
      /(exist|duplicate|used|tồn tại|sử dụng)/i.test(rawMessage)
    ) {
      return 'Mã sinh viên đã tồn tại. Vui lòng kiểm tra lại.';
    }

    if (status === 409) {
      return 'Email hoặc mã sinh viên đã được sử dụng.';
    }

    if (status >= 500) {
      return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
    }

    if (status === 400 && rawMessage) {
      return rawMessage;
    }

    return rawMessage || 'Đăng ký thất bại. Vui lòng thử lại.';
  }

  onRegister(event: Event): void {
    event.preventDefault();

    if (this.isLoading || this.successMessage) return;

    this.errorMessage = '';

    const msv = this.MSV.trim();
    const tenSV = this.TENSV.trim();
    const email = this.EMAIL.trim();

    if (!msv || !tenSV || !email || !this.MATKHAU || !this.XAC_NHAN_MAT_KHAU) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin bắt buộc.';
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(msv)) {
      this.errorMessage = 'Mã sinh viên chỉ được chứa chữ cái và chữ số.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMessage = 'Email không đúng định dạng.';
      return;
    }

    if (!this.isPasswordValid) {
      this.errorMessage = 'Mật khẩu chưa đáp ứng đủ các yêu cầu bảo mật.';
      this.showPasswordGuide = true;
      return;
    }

    if (!this.isConfirmPasswordValid) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp.';
      return;
    }

    if (!this.agreedToTerms) {
      this.errorMessage = 'Vui lòng đồng ý với điều khoản dịch vụ.';
      return;
    }

    this.isLoading = true;

    this.auth
      .register({
        MSV: msv,
        TENSV: tenSV,
        EMAIL: email,
        MATKHAU: this.MATKHAU,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;

          this.successMessage = 'Tạo tài khoản thành công! Đang chuyển đến trang đăng nhập...';

          this.cdr.detectChanges();

          this.redirectTimer = setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },

        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
          this.cdr.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
  }
}
