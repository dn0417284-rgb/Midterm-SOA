import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Auth } from '../../../core/services/auth';

interface SinhVien {
  MSV: string;
  TENSV: string;
  KHOA?: string | null;
  LOP?: string | null;
  EMAIL?: string | null;
  DIEMTB?: number | string | null;
}

interface DangKy {
  MSV: string;
  DETAI_ID: number;
  NGAY_DANG_KY: string;
}

interface DeTai {
  MDT: number;
  tenDetai: string;
  giangVienHuongDan: string;
  moTa: string;
  trangThai: number;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard implements OnInit {
  user: SinhVien | null = null;

  currentRegistration: DangKy | null = null;
  currentTopic: DeTai | null = null;

  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly auth: Auth,
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser() as SinhVien | null;

    this.loadRegistration();
  }

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });
  }

  loadRegistration(): void {
    const msv = this.studentCode;

    if (!msv) {
      this.errorMessage = 'Không tìm thấy mã sinh viên. Vui lòng đăng nhập lại.';

      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    if (!this.auth.getToken()) {
      this.errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';

      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.currentRegistration = null;
    this.currentTopic = null;
    this.http
      .get<DangKy[]>(`/api/dangky/sinhvien/${encodeURIComponent(msv)}`, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (registrations) => {
          if (!Array.isArray(registrations)) {
            this.errorMessage = 'Dữ liệu đăng ký không hợp lệ.';

            this.isLoading = false;
            this.cdr.detectChanges();
            return;
          }
          if (registrations.length === 0) {
            this.currentRegistration = null;
            this.currentTopic = null;

            this.isLoading = false;
            this.cdr.detectChanges();
            return;
          }
          this.currentRegistration = registrations[0];

          this.loadTopic(this.currentRegistration.DETAI_ID);
        },

        error: (error) => {
          console.error('Lỗi lấy thông tin đăng ký:', error);

          this.errorMessage = this.getErrorMessage(error);

          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private loadTopic(detaiId: number): void {
    this.http
      .get<DeTai>(`/api/detai/${detaiId}`, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (topic) => {
          this.currentTopic = topic;

          this.isLoading = false;
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Lỗi lấy thông tin đề tài:', error);

          this.errorMessage = 'Đã tìm thấy đăng ký nhưng không thể tải thông tin đề tài.';

          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    }

    if (error.status === 403) {
      return 'Bạn không có quyền xem thông tin đăng ký này.';
    }

    if (error.status === 0) {
      return 'Không thể kết nối đến máy chủ.';
    }

    const message = error?.error?.message;

    if (typeof message === 'string' && error.status !== 500) {
      return message;
    }

    return 'Không thể tải thông tin đăng ký. Vui lòng thử lại.';
  }

  get registrationStatus(): string {
    if (!this.currentRegistration) {
      return 'Chưa đăng ký';
    }

    return 'Đã đăng ký';
  }

  get registrationStatusClass(): string {
    return this.currentRegistration ? 'badge-success' : 'badge-warning';
  }

  get studentName(): string {
    return this.user?.TENSV || 'Sinh viên';
  }

  get studentCode(): string {
    return this.user?.MSV || '';
  }

  get studentFaculty(): string {
    return this.user?.KHOA || '';
  }

  get studentClass(): string {
    return this.user?.LOP || '';
  }

  get studentEmail(): string {
    return this.user?.EMAIL || '';
  }

  get studentGPA(): string {
    const gpa = this.user?.DIEMTB;
    return gpa === null || gpa === undefined ? '' : String(gpa);
  }

  get topicName(): string {
    return this.currentTopic?.tenDetai || 'Chưa chọn đề tài';
  }

  get topicTeacher(): string {
    return this.currentTopic?.giangVienHuongDan || 'Chưa có';
  }

  get topicDescription(): string {
    return this.currentTopic?.moTa || '';
  }

  get registrationDate(): string | null {
    return this.currentRegistration?.NGAY_DANG_KY || null;
  }
}
