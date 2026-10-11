
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Auth } from '../../../core/services/auth';

interface SinhVien {
  MSV: string;
  TENSV: string;
  KHOA: string | null;
  DIEMTB: string | number | null;
  LOP: string | null;
  EMAIL: string | null;
  VAITRO: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  totalStudents: number | null = null;

  isLoadingStudents = true;
  studentError = '';

  totalTeachers: number | null = null;
  registeredTopics: number | null = null;
  unregisteredTopics: number | null = null;

  recentTopics: {
    name: string;
    description: string;
    teacher: string;
    status: string;
  }[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly auth: Auth,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {

    const token = this.auth.getToken();

    if (!token) {
      this.studentError = 'Chưa đăng nhập.';
      this.isLoadingStudents = false;
      this.cdr.detectChanges();
      return;
    }

    this.isLoadingStudents = true;
    this.studentError = '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<SinhVien[]>(
      '/api/sinhvien',
      { headers },
    ).subscribe({

      next: (students) => {

        console.log('Danh sách sinh viên:', students);

        if (Array.isArray(students)) {

          this.totalStudents = students.filter(
            (student) => student.VAITRO === 'SINHVIEN',
          ).length;

        } else {

          this.studentError = 'Dữ liệu API không hợp lệ.';
          this.totalStudents = null;

        }

        this.isLoadingStudents = false;

        // Cập nhật giao diện sau khi nhận dữ liệu
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Lỗi API sinh viên:', error);

        this.studentError = 'Không thể tải sinh viên.';
        this.totalStudents = null;
        this.isLoadingStudents = false;

        this.cdr.detectChanges();
      },
    });
  }
}
