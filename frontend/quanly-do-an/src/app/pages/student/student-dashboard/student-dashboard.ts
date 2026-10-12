import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard {

  // Thông tin sinh viên đang đăng nhập
  user: any = null;

  constructor(private auth: Auth) {}

  ngOnInit(): void {

    // Lấy thông tin user từ session
    this.user = this.auth.getUser();

  }

  // Tên sinh viên lấy từ TENSV
  get studentName(): string {
    return this.user?.TENSV || '';
  }

  // Mã sinh viên
  get studentCode(): string {
    return this.user?.MSV || '';
  }

  // Khoa
  get studentFaculty(): string {
    return this.user?.KHOA || '';
  }

  // Lớp
  get studentClass(): string {
    return this.user?.LOP || '';
  }

  // Email
  get studentEmail(): string {
    return this.user?.EMAIL || '';
  }

  // Điểm trung bình
  get studentGPA(): string {
    return this.user?.DIEMTB || '';
  }
}
