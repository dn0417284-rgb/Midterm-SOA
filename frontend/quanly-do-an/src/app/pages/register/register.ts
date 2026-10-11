import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private router: Router) { }

  onRegister(event: Event) {
    event.preventDefault();
    // Sau khi đăng ký thành công, chuyển hướng người dùng về trang đăng nhập
    this.router.navigate(['/login']);
  }
}
