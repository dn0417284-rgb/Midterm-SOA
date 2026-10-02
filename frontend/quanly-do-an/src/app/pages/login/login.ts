import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router) { }

  onLogin(event: Event) {
    event.preventDefault();
    // Tạm thời điều hướng mẫu vào trang admin/dashboard khi ấn đăng nhập
    // Sau này bạn có thể viết logic kiểm tra tài khoản/mật khẩu thực tế ở đây
    this.router.navigate(['/admin/dashboard']);
  }
}
