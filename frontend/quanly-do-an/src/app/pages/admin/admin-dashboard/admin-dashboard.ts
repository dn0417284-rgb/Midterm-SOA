import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

interface DeTai {
  MDT: number;
  tenDetai: string;
  giangVienHuongDan: string;
  moTa: string;
  trangThai: number;
}

interface RecentTopic {
  name: string;
  description: string;
  teacher: string;
  status: string;
  statusClass: string;
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
  totalTeachers: number | null = null;
  registeredTopics: number | null = null;
  unregisteredTopics: number | null = null;

  isLoadingStudents = true;
  isLoadingTopics = true;

  studentError = '';
  topicError = '';

  recentTopics: RecentTopic[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly auth: Auth,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });
  }

  loadDashboard(): void {
    this.loadStudents();
    this.loadTopics();
  }

  loadStudents(): void {
    const token = this.auth.getToken();

    if (!token) {
      this.studentError = 'Chưa đăng nhập.';
      this.totalStudents = null;
      this.isLoadingStudents = false;
      this.cdr.detectChanges();
      return;
    }

    this.isLoadingStudents = true;
    this.studentError = '';

    this.http
      .get<SinhVien[]>('/api/sinhvien', {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (students) => {
          if (Array.isArray(students)) {
            this.totalStudents = students.filter(
              (student) => student.VAITRO?.toUpperCase() === 'SINHVIEN',
            ).length;
          } else {
            this.totalStudents = null;
            this.studentError = 'Dữ liệu sinh viên không hợp lệ.';
          }

          this.isLoadingStudents = false;
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Lỗi lấy danh sách sinh viên:', error);

          this.totalStudents = null;
          this.isLoadingStudents = false;

          if (error.status === 401) {
            this.studentError = 'Phiên đăng nhập đã hết hạn.';
          } else if (error.status === 403) {
            this.studentError = 'Không có quyền xem sinh viên.';
          } else {
            this.studentError = 'Không thể tải dữ liệu sinh viên.';
          }

          this.cdr.detectChanges();
        },
      });
  }

  loadTopics(): void {
    const token = this.auth.getToken();

    if (!token) {
      this.topicError = 'Chưa đăng nhập.';
      this.isLoadingTopics = false;
      this.cdr.detectChanges();
      return;
    }

    this.isLoadingTopics = true;
    this.topicError = '';

    this.http
      .get<DeTai[]>('/api/detai', {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (topics) => {
          if (!Array.isArray(topics)) {
            this.topicError = 'Dữ liệu đề tài không hợp lệ.';

            this.totalTeachers = null;
            this.registeredTopics = null;
            this.unregisteredTopics = null;
            this.recentTopics = [];

            this.isLoadingTopics = false;
            this.cdr.detectChanges();
            return;
          }

          const teachers = topics
            .map((topic) => topic.giangVienHuongDan?.trim())
            .filter((name): name is string => !!name);

          const uniqueTeachers = new Set(teachers.map((name) => this.normalizeText(name)));

          this.totalTeachers = uniqueTeachers.size;

          this.registeredTopics = topics.filter((topic) => Number(topic.trangThai) === 1).length;

          this.unregisteredTopics = topics.filter((topic) => Number(topic.trangThai) === 0).length;

          this.recentTopics = [...topics]
            .sort((a, b) => Number(b.MDT) - Number(a.MDT))
            .slice(0, 5)
            .map((topic) => ({
              name: topic.tenDetai,
              description: topic.moTa,
              teacher: topic.giangVienHuongDan,
              status: Number(topic.trangThai) === 1 ? 'Đã đăng ký' : 'Chưa đăng ký',
              statusClass: Number(topic.trangThai) === 1 ? 'badge-danger' : 'badge-success',
            }));

          this.isLoadingTopics = false;
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Lỗi lấy danh sách đề tài:', error);

          this.totalTeachers = null;
          this.registeredTopics = null;
          this.unregisteredTopics = null;
          this.recentTopics = [];

          this.isLoadingTopics = false;

          if (error.status === 401) {
            this.topicError = 'Phiên đăng nhập đã hết hạn.';
          } else if (error.status === 403) {
            this.topicError = 'Không có quyền xem danh sách đề tài.';
          } else {
            this.topicError = 'Không thể tải dữ liệu đề tài.';
          }

          this.cdr.detectChanges();
        },
      });
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
}
