
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';

interface DangKy {
  MSV: string;
  DETAI_ID: number;
  NGAY_DANG_KY: string;
}

interface SinhVien {
  MSV: string;
  TENSV: string;
}

interface DeTai {
  MDT: number;
  tenDetai: string;
  giangVienHuongDan: string;
  moTa: string;
  trangThai: number;
}

interface RegistrationRow {
  msv: string;
  studentName: string;
  detaiId: number;
  topicName: string;
  registrationDate: string;
}

@Component({
  selector: 'app-admin-registrations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-registrations.html',
  styleUrl: './admin-registrations.css',
})
export class AdminRegistrations implements OnInit {
  registrations: RegistrationRow[] = [];

  searchText = '';

  isLoading = false;
  isCancelling = false;

  isCancelModalOpen = false;
  isSuccessModalOpen = false;
  isErrorModalOpen = false;

  errorMessage = '';
  modalErrorMessage = '';

  selectedRegistration: RegistrationRow | null = null;

  private readonly dangkyUrl = '/api/dangky';
  private readonly sinhvienUrl = '/api/sinhvien';
  private readonly detaiUrl = '/api/detai';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  // ======================================
  // LẤY TOKEN
  // ======================================

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });
  }

  // ======================================
  // LẤY DANH SÁCH ĐĂNG KÝ
  // ======================================

  loadRegistrations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const headers = this.getHeaders();

    this.http
      .get<DangKy[]>(this.dangkyUrl, { headers })
      .pipe(
        switchMap((dangKyList) => {
          if (dangKyList.length === 0) {
            return of([] as RegistrationRow[]);
          }

          // Lấy danh sách đề tài một lần
          const topicsRequest = this.http
            .get<DeTai[]>(this.detaiUrl, { headers })
            .pipe(
              catchError((error) => {
                console.error(
                  'Không thể lấy danh sách đề tài:',
                  error,
                );
                return of([] as DeTai[]);
              }),
            );

          // Lấy thông tin từng sinh viên
          const uniqueMsv = [
            ...new Set(dangKyList.map((dk) => dk.MSV)),
          ];

          const studentRequests = uniqueMsv.map((msv) =>
            this.http
              .get<SinhVien>(
                `${this.sinhvienUrl}/${encodeURIComponent(msv)}`,
                { headers },
              )
              .pipe(
                catchError((error) => {
                  console.error(
                    `Không thể lấy sinh viên ${msv}:`,
                    error,
                  );

                  return of({
                    MSV: msv,
                    TENSV: '',
                  } as SinhVien);
                }),
              ),
          );

          return forkJoin({
            topics: topicsRequest,
            students: forkJoin(studentRequests),
          }).pipe(
            map(({ topics, students }) => {
              return dangKyList.map((dk) => {
                const student = students.find(
                  (sv) => sv.MSV === dk.MSV,
                );

                const topic = topics.find(
                  (dt) => Number(dt.MDT) === Number(dk.DETAI_ID),
                );

                return {
                  msv: dk.MSV,
                  studentName: student?.TENSV || 'Chưa có thông tin',
                  detaiId: dk.DETAI_ID,
                  topicName: topic?.tenDetai || 'Chưa có thông tin',
                  registrationDate: dk.NGAY_DANG_KY,
                };
              });
            }),
          );
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          this.registrations = data;
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(
            'Lỗi lấy danh sách đăng ký:',
            err,
          );

          this.registrations = [];

          if (err.status === 401) {
            this.errorMessage =
              'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          } else if (err.status === 403) {
            this.errorMessage =
              'Bạn không có quyền xem danh sách đăng ký.';
          } else {
            this.errorMessage =
              'Không thể tải danh sách đăng ký. Vui lòng thử lại.';
          }

          this.cdr.detectChanges();
        },
      });
  }

  // ======================================
  // CHUẨN HÓA CHUỖI TÌM KIẾM
  // ======================================

  normalizeText(value: string | null | undefined): string {
    return (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  // ======================================
  // TÌM KIẾM ĐĂNG KÝ
  // ======================================

  get filteredRegistrations(): RegistrationRow[] {
    const keyword = this.normalizeText(this.searchText);

    if (!keyword) {
      return this.registrations;
    }

    return this.registrations.filter((item) => {
      return (
        this.normalizeText(item.msv).includes(keyword) ||
        this.normalizeText(item.studentName).includes(keyword) ||
        this.normalizeText(String(item.detaiId)).includes(keyword) ||
        this.normalizeText(item.topicName).includes(keyword)
      );
    });
  }

  // ======================================
  // MỞ POPUP XÁC NHẬN HỦY
  // ======================================

  openCancelModal(registration: RegistrationRow): void {
    if (this.isCancelling) {
      return;
    }

    this.selectedRegistration = registration;
    this.modalErrorMessage = '';
    this.isCancelModalOpen = true;
  }

  // ======================================
  // ĐÓNG POPUP XÁC NHẬN HỦY
  // ======================================

  closeCancelModal(): void {
    if (this.isCancelling) {
      return;
    }

    this.isCancelModalOpen = false;
    this.selectedRegistration = null;
    this.modalErrorMessage = '';
  }

  // ======================================
  // XÁC NHẬN HỦY ĐĂNG KÝ
  // ======================================

  confirmCancel(): void {
    if (!this.selectedRegistration || this.isCancelling) {
      return;
    }

    const registration = this.selectedRegistration;

    this.isCancelling = true;
    this.modalErrorMessage = '';

    const url =
      `${this.dangkyUrl}/${registration.detaiId}` +
      `/${encodeURIComponent(registration.msv)}`;

    this.http
      .delete<{ deleted: boolean }>(url, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: () => {
          this.isCancelling = false;

          this.isCancelModalOpen = false;
          this.selectedRegistration = null;

          this.isSuccessModalOpen = true;

          this.loadRegistrations();
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(
            'Lỗi hủy đăng ký:',
            err,
          );

          this.isCancelling = false;

          const serverMessage = err.error?.message;

          if (Array.isArray(serverMessage)) {
            this.modalErrorMessage =
              serverMessage.join(', ');
          } else if (
            typeof serverMessage === 'string' &&
            err.status !== 500
          ) {
            this.modalErrorMessage = serverMessage;
          } else if (err.status === 403) {
            this.modalErrorMessage =
              'Bạn không có quyền hủy đăng ký này.';
          } else if (err.status === 404) {
            this.modalErrorMessage =
              'Không tìm thấy đăng ký cần hủy.';
          } else {
            this.modalErrorMessage =
              'Không thể hủy đăng ký. Vui lòng thử lại.';
          }

          this.cdr.detectChanges();
        },
      });
  }

  // ======================================
  // ĐÓNG POPUP THÀNH CÔNG
  // ======================================

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
  }

  // ======================================
  // ĐÓNG POPUP LỖI
  // ======================================

  closeErrorModal(): void {
    this.isErrorModalOpen = false;
  }
}
