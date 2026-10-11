
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Detai,
  DetaiService,
} from '../../../core/services/detai';

import {
  DangKyService,
} from '../../../core/services/dangky';

@Component({
  selector: 'app-student-topic-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-topic-register.html',
  styleUrl: './student-topic-register.css',
})
export class StudentTopicRegister implements OnInit {
  topics: Detai[] = [];

  searchText = '';
  filterLecturer = '';
  filterStatus = '';

  editTopicData: Partial<Detai> = {};

  isLoading = false;
  isSaving = false;
  isRegistering = false;

  errorMessage = '';

  isAddTopicModalOpen = false;
  isAddSuccessModalOpen = false;
  isRegisterSuccessModalOpen = false;

  // Popup thông báo đăng ký thất bại
  isRegisterErrorModalOpen = false;
  registerErrorMessage = '';

  // ==========================
  // PHÂN TRANG
  // ==========================

  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private detaiService: DetaiService,
    private dangKyService: DangKyService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTopics();
  }

  // ==========================
  // LẤY DANH SÁCH ĐỀ TÀI
  // ==========================

  loadTopics(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.detaiService.getAll().subscribe({
      next: (data) => {
        this.topics = data;
        this.isLoading = false;

        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(
          'Lỗi khi lấy danh sách đề tài:',
          err,
        );

        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage =
            'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (err.status === 403) {
          this.errorMessage =
            'Bạn không có quyền xem danh sách đề tài.';
        } else {
          this.errorMessage =
            'Không thể tải danh sách đề tài. Vui lòng thử lại.';
        }

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================
  // CHUẨN HÓA TIẾNG VIỆT
  // ==========================

  normalizeText(
    value: string | null | undefined,
  ): string {
    return (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  // ==========================
  // TÌM KIẾM VÀ BỘ LỌC
  // ==========================

  get filteredTopics(): Detai[] {
    const keyword = this.normalizeText(
      this.searchText,
    );

    return this.topics.filter((topic) => {
      const matchSearch =
        !keyword ||
        this.normalizeText(topic.name).includes(keyword) ||
        topic.MDT.toString().includes(keyword);

      const matchStatus =
        !this.filterStatus ||
        topic.status.toString() === this.filterStatus;

      const matchLecturer =
        !this.filterLecturer ||
        topic.lecturer === this.filterLecturer;

      return (
        matchSearch &&
        matchStatus &&
        matchLecturer
      );
    });
  }

  get lecturers(): string[] {
    return [
      ...new Set(
        this.topics
          .map((topic) => topic.lecturer)
          .filter((name) => !!name),
      ),
    ];
  }

  // ==========================
  // THÊM ĐỀ TÀI
  // ==========================

  openAddTopicModal(): void {
    this.editTopicData = {};
    this.errorMessage = '';
    this.isAddTopicModalOpen = true;
  }

  closeAddTopicModal(): void {
    if (this.isSaving) {
      return;
    }

    this.isAddTopicModalOpen = false;
  }

  submitAddTopic(event: Event): void {
    event.preventDefault();

    if (this.isSaving) {
      return;
    }

    const name =
      this.editTopicData.name?.trim() ?? '';

    const lecturer =
      this.editTopicData.lecturer?.trim() ?? '';

    if (!name || !lecturer) {
      this.errorMessage =
        'Vui lòng nhập tên đề tài và giảng viên hướng dẫn.';

      this.cdr.detectChanges();
      return;
    }

    const newTopic: Detai = {
      MDT: 0,
      name,
      desc:
        this.editTopicData.desc?.trim() ?? '',
      lecturer,
      status: 0,
    };

    this.isSaving = true;
    this.errorMessage = '';

    this.detaiService.add(newTopic).subscribe({
      next: () => {
        this.isSaving = false;

        this.closeAddTopicModal();

        this.isAddSuccessModalOpen = true;

        this.loadTopics();

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(
          'Lỗi khi thêm đề tài:',
          err,
        );

        this.isSaving = false;

        this.errorMessage =
          this.getServerMessage(err) ||
          'Không thể thêm đề tài. Vui lòng thử lại.';

        this.cdr.detectChanges();
      },
    });
  }

  closeAddSuccessModal(): void {
    this.isAddSuccessModalOpen = false;
  }

  // ==========================
  // LẤY THÔNG BÁO LỖI TỪ BACKEND
  // ==========================

  private getServerMessage(err: any): string {
    const serverMessage = err?.error?.message;

    if (Array.isArray(serverMessage)) {
      return serverMessage.join(', ');
    }

    if (typeof serverMessage === 'string') {
      return serverMessage;
    }

    return '';
  }

  // ==========================
  // HIỂN THỊ POPUP ĐĂNG KÝ LỖI
  // ==========================

  private showRegisterError(
    message: string,
  ): void {
    this.registerErrorMessage = message;
    this.isRegisterErrorModalOpen = true;

    this.cdr.detectChanges();
  }

  // ==========================
  // ĐĂNG KÝ ĐỀ TÀI
  // ==========================

  registerTopic(topic: Detai): void {
    // Không cho đăng ký đề tài đã có người đăng ký
    if (Number(topic.status) === 1) {
      this.showRegisterError(
        'Đề tài này đã có sinh viên đăng ký. Vui lòng chọn đề tài khác.',
      );
      return;
    }

    // Không cho nhấn đăng ký liên tục
    if (this.isRegistering) {
      return;
    }

    this.isRegistering = true;

    this.errorMessage = '';
    this.registerErrorMessage = '';

    this.dangKyService
      .registerTopic(topic.MDT)
      .subscribe({
        next: () => {
          this.isRegistering = false;

          // Hiển thị popup đăng ký thành công
          this.isRegisterSuccessModalOpen = true;

          // Cập nhật lại danh sách đề tài
          this.loadTopics();

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(
            'Lỗi khi đăng ký đề tài:',
            err,
          );

          this.isRegistering = false;

          const message =
            this.getServerMessage(err);

          if (err.status === 409) {
            // Sinh viên đã đăng ký hoặc đề tài đã có người
            this.showRegisterError(
              message ||
              'Bạn đã đăng ký một đề tài. Vui lòng hủy đăng ký cũ trước khi đăng ký đề tài khác.',
            );
          } else if (err.status === 401) {
            this.showRegisterError(
              'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            );
          } else if (err.status === 403) {
            this.showRegisterError(
              message ||
              'Bạn không có quyền đăng ký đề tài này.',
            );
          } else if (err.status === 400) {
            this.showRegisterError(
              message ||
              'Thông tin đăng ký không hợp lệ.',
            );
          } else if (err.status === 404) {
            this.showRegisterError(
              message ||
              'Không tìm thấy sinh viên hoặc đề tài.',
            );
          } else if (err.status === 500) {
            this.showRegisterError(
              'Hệ thống gặp lỗi khi xử lý đăng ký. Vui lòng thử lại hoặc liên hệ quản trị viên.',
            );
          } else if (err.status === 0) {
            this.showRegisterError(
              'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối.',
            );
          } else {
            this.showRegisterError(
              message ||
              'Đăng ký đề tài thất bại. Vui lòng thử lại.',
            );
          }

          this.cdr.detectChanges();
        },
      });
  }

  // ==========================
  // POPUP ĐĂNG KÝ THÀNH CÔNG
  // ==========================

  openRegisterSuccessModal(): void {
    this.isRegisterSuccessModalOpen = true;
  }

  closeRegisterSuccessModal(): void {
    this.isRegisterSuccessModalOpen = false;
  }

  // ==========================
  // POPUP ĐĂNG KÝ THẤT BẠI
  // ==========================

  closeRegisterErrorModal(): void {
    this.isRegisterErrorModalOpen = false;
    this.registerErrorMessage = '';
  }

  // ==========================
  // HIỂN THỊ TRẠNG THÁI
  // ==========================

  getStatusText(status: number): string {
    return Number(status) === 1
      ? 'Đã đăng ký'
      : 'Chưa đăng ký';
  }

  getStatusClass(status: number): string {
    return Number(status) === 1
      ? 'badge badge-danger'
      : 'badge badge-success';
  }

  // ==========================
  // PHÂN TRANG
  // ==========================

  get totalItems(): number {
    return this.filteredTopics.length;
  }

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(
        this.totalItems / this.pageSize,
      ),
    );
  }

  get paginatedTopics(): Detai[] {
    const page = Math.min(
      this.currentPage,
      this.totalPages,
    );

    const start =
      (page - 1) * this.pageSize;

    return this.filteredTopics.slice(
      start,
      start + this.pageSize,
    );
  }

  get startItem(): number {
    if (this.totalItems === 0) {
      return 0;
    }

    const page = Math.min(
      this.currentPage,
      this.totalPages,
    );

    return (
      (page - 1) * this.pageSize + 1
    );
  }

  get endItem(): number {
    const page = Math.min(
      this.currentPage,
      this.totalPages,
    );

    return Math.min(
      page * this.pageSize,
      this.totalItems,
    );
  }

  changePage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }
}
