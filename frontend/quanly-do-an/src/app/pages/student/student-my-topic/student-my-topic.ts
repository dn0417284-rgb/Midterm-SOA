import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DangKy, DangKyService } from '../../../core/services/dangky';
import { Detai, DetaiService } from '../../../core/services/detai';

@Component({
  selector: 'app-student-my-topic',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-my-topic.html',
  styleUrl: './student-my-topic.css',
})
export class StudentMyTopic implements OnInit {
  isCancelModalOpen = false;
  isSuccessModalOpen = false;

  isLoading = true;
  isCancelling = false;
  errorMessage = '';

  registration: DangKy | null = null;
  topic: Detai | null = null;

  constructor(
    private dangKyService: DangKyService,
    private detaiService: DetaiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMyTopic();
  }
  getCurrentMSV(): string | null {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];

      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

      const decoded = JSON.parse(atob(base64));

      return decoded.sub != null ? String(decoded.sub) : null;
    } catch {
      return null;
    }
  }
  get topicCode(): number | null {
    if (!this.registration) {
      return null;
    }

    const data = this.registration as any;

    const value = data.detaiId ?? data.DETAI_ID ?? data.MDT ?? data.detai?.MDT;

    if (value == null) {
      return null;
    }

    const id = Number(value);

    return Number.isFinite(id) ? id : null;
  }
  get registrationDate(): string {
    if (!this.registration) {
      return 'Chưa cập nhật';
    }

    const data = this.registration as any;

    const date = data.NGAY_DANG_KY ?? data.ngayDangKy ?? data.createdAt;

    if (!date) {
      return 'Chưa cập nhật';
    }

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime()) ? 'Chưa cập nhật' : parsed.toLocaleDateString('vi-VN');
  }
  get registrationStatus(): string {
    if (!this.registration) {
      return '';
    }

    const data = this.registration as any;

    const status = data.TRANG_THAI ?? data.trangThai;

    return status == null ? '' : String(status).toUpperCase();
  }
  get statusText(): string {
    const status = this.registrationStatus;

    switch (status) {
      case 'CHO_DUYET':
      case 'PENDING':
      case '0':
        return 'Chờ duyệt';

      case 'DA_DUYET':
      case 'APPROVED':
      case '1':
        return 'Đã duyệt';

      case 'TU_CHOI':
      case 'REJECTED':
      case '2':
        return 'Từ chối';

      default:
        return status || 'Chưa cập nhật';
    }
  }
  get canCancel(): boolean {
    return (
      this.registration !== null &&
      this.registrationStatus !== 'DA_DUYET' &&
      this.registrationStatus !== 'APPROVED' &&
      this.registrationStatus !== '1'
    );
  }
  loadMyTopic(): void {
    const msv = this.getCurrentMSV();

    this.isLoading = true;
    this.errorMessage = '';
    this.registration = null;
    this.topic = null;

    if (!msv) {
      this.isLoading = false;
      this.errorMessage = 'Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.';
      this.cdr.detectChanges();
      return;
    }

    this.dangKyService.getBySinhVien(msv).subscribe({
      next: (response) => {
        const item = Array.isArray(response) ? (response[0] ?? null) : response;

        this.registration = item;

        if (!item) {
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        const detaiId = this.topicCode;

        if (detaiId === null) {
          this.isLoading = false;
          this.errorMessage = 'Không tìm thấy mã đề tài trong thông tin đăng ký.';
          this.cdr.detectChanges();
          return;
        }

        this.detaiService.getByCode(detaiId).subscribe({
          next: (topic) => {
            this.topic = topic;
            this.isLoading = false;
            this.cdr.detectChanges();
          },

          error: (error) => {
            this.isLoading = false;

            this.errorMessage = error.error?.message ?? 'Không thể tải thông tin đề tài.';

            this.cdr.detectChanges();
          },
        });
      },

      error: (error) => {
        this.isLoading = false;

        if (error.status === 404) {
          this.registration = null;
          this.topic = null;
        } else {
          this.errorMessage = error.error?.message ?? 'Không thể tải thông tin đăng ký đề tài.';
        }

        this.cdr.detectChanges();
      },
    });
  }
  openCancelModal(): void {
    if (!this.canCancel) {
      return;
    }

    this.isCancelModalOpen = true;
  }
  closeCancelModal(): void {
    if (this.isCancelling) {
      return;
    }

    this.isCancelModalOpen = false;
  }
  confirmCancel(): void {
    const detaiId = this.topicCode;
    const msv = this.getCurrentMSV();

    if (detaiId === null || !msv || !this.canCancel || this.isCancelling) {
      return;
    }

    this.isCancelling = true;
    this.errorMessage = '';

    this.dangKyService.cancelRegistration(detaiId, msv).subscribe({
      next: () => {
        this.isCancelling = false;
        this.isCancelModalOpen = false;
        this.isSuccessModalOpen = true;

        this.registration = null;
        this.topic = null;

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.isCancelling = false;
        this.isCancelModalOpen = false;

        this.errorMessage = error.error?.message ?? 'Không thể hủy đăng ký. Vui lòng thử lại.';

        this.cdr.detectChanges();
      },
    });
  }
  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
  }
}
