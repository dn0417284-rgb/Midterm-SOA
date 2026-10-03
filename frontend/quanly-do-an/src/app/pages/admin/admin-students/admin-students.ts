import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Student {
  MSV: string;
  TENSV: string;
  KHOA: string | null;
  DIEMTB: number | null;
  LOP: string | null;
  EMAIL: string;
  MATKHAU?: string;
  VAITRO: string;
}

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-students.html',
  styleUrl: './admin-students.css',
})
export class AdminStudents implements OnInit {
  private readonly apiUrl = 'http://localhost:3000/sinhvien';

  students: Student[] = [];
  filteredStudents: Student[] = [];

  searchKeyword = '';

  // Chỉ true trong thời gian đang gọi API
  isLoading = true;

  errorMessage = '';

  // ================================
  // PHÂN TRANG
  // ================================

  currentPage = 1;

  pageSize = 10;

  // ================================
  // MODAL
  // ================================

  isModalOpen = false;

  isDeleteModalOpen = false;

  isSuccessModalOpen = false;

  selectedStudent: Student | null = null;

  studentToDelete = {
    code: '',
    name: '',
  };

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  // =========================================================
  // LẤY DANH SÁCH SINH VIÊN
  // =========================================================

  loadStudents(): void {
    this.isLoading = true;

    this.errorMessage = '';

    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<Student[]>(this.apiUrl, { headers }).subscribe({
      next: (students) => {
        console.log('Danh sách sinh viên:', students);

        this.students = Array.isArray(students)
          ? students
          : [];

        // Khi mới load trang:
        // hiển thị toàn bộ danh sách
        this.filteredStudents = [...this.students];

        this.currentPage = 1;

        this.isLoading = false;
      },

      error: (error) => {
        console.error(
          'Lỗi lấy danh sách sinh viên:',
          error
        );

        this.students = [];

        this.filteredStudents = [];

        this.isLoading = false;

        this.errorMessage =
          error?.error?.message ||
          'Không thể tải danh sách sinh viên.';
      },
    });
  }

  // =========================================================
  // TÌM KIẾM
  // =========================================================

  searchStudents(): void {
    const keyword =
      this.searchKeyword
        .trim()
        .toLowerCase();

    // Mỗi lần tìm kiếm
    // quay lại trang đầu
    this.currentPage = 1;

    // Không có từ khóa
    // => hiển thị toàn bộ
    if (!keyword) {
      this.filteredStudents = [
        ...this.students,
      ];

      return;
    }

    this.filteredStudents =
      this.students.filter((student) => {
        const msv =
          student.MSV?.toLowerCase() || '';

        const name =
          student.TENSV?.toLowerCase() || '';

        const email =
          student.EMAIL?.toLowerCase() || '';

        const lop =
          student.LOP?.toLowerCase() || '';

        const khoa =
          student.KHOA?.toLowerCase() || '';

        return (
          msv.includes(keyword) ||
          name.includes(keyword) ||
          email.includes(keyword) ||
          lop.includes(keyword) ||
          khoa.includes(keyword)
        );
      });
  }

  // =========================================================
  // SINH VIÊN TRÊN TRANG HIỆN TẠI
  // =========================================================

  get paginatedStudents(): Student[] {
    const startIndex =
      (this.currentPage - 1) *
      this.pageSize;

    const endIndex =
      startIndex + this.pageSize;

    return this.filteredStudents.slice(
      startIndex,
      endIndex
    );
  }

  // =========================================================
  // TỔNG SỐ TRANG
  // =========================================================

  get totalPages(): number {
    if (this.filteredStudents.length === 0) {
      return 0;
    }

    return Math.ceil(
      this.filteredStudents.length /
      this.pageSize
    );
  }

  // =========================================================
  // DANH SÁCH NÚT TRANG
  // =========================================================

  get pageNumbers(): (number | string)[] {
    const total = this.totalPages;

    const current = this.currentPage;

    if (total <= 0) {
      return [];
    }

    // Nếu <= 7 trang
    // hiển thị toàn bộ
    if (total <= 7) {
      return Array.from(
        { length: total },
        (_, index) => index + 1
      );
    }

    const pages: (number | string)[] = [];

    // Trang đầu
    pages.push(1);

    // ======================================
    // ĐANG Ở GẦN ĐẦU
    // ======================================

    if (current <= 4) {
      pages.push(2);
      pages.push(3);
      pages.push(4);
      pages.push(5);
      pages.push('...');
      pages.push(total);

      return pages;
    }

    // ======================================
    // ĐANG Ở GẦN CUỐI
    // ======================================

    if (current >= total - 3) {
      pages.push('...');

      pages.push(total - 4);
      pages.push(total - 3);
      pages.push(total - 2);
      pages.push(total - 1);
      pages.push(total);

      return pages;
    }

    // ======================================
    // ĐANG Ở GIỮA
    // ======================================

    pages.push('...');

    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);

    pages.push('...');

    pages.push(total);

    return pages;
  }

  // =========================================================
  // CHUYỂN ĐẾN TRANG
  // =========================================================

  goToPage(page: number | string): void {
    if (typeof page !== 'number') {
      return;
    }

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;
  }

  // =========================================================
  // TRANG TRƯỚC
  // =========================================================

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // =========================================================
  // TRANG SAU
  // =========================================================

  nextPage(): void {
    if (
      this.currentPage <
      this.totalPages
    ) {
      this.currentPage++;
    }
  }

  // =========================================================
  // SỐ THỨ TỰ BẢN GHI ĐẦU TIÊN
  // =========================================================

  get startItem(): number {
    if (
      this.isLoading ||
      this.filteredStudents.length === 0
    ) {
      return 0;
    }

    return (
      (this.currentPage - 1) *
      this.pageSize +
      1
    );
  }

  // =========================================================
  // SỐ THỨ TỰ BẢN GHI CUỐI
  // =========================================================

  get endItem(): number {
    if (
      this.isLoading ||
      this.filteredStudents.length === 0
    ) {
      return 0;
    }

    return Math.min(
      this.currentPage *
        this.pageSize,
      this.filteredStudents.length
    );
  }

  // =========================================================
  // MỞ CHI TIẾT
  // =========================================================

  openModal(student: Student): void {
    this.selectedStudent = student;

    this.isModalOpen = true;
  }

  // =========================================================
  // ĐÓNG CHI TIẾT
  // =========================================================

  closeModal(): void {
    this.isModalOpen = false;

    this.selectedStudent = null;
  }

  // =========================================================
  // MỞ XÁC NHẬN XÓA
  // =========================================================

  openDeleteModal(
    student: Student
  ): void {
    this.studentToDelete = {
      code: student.MSV,
      name: student.TENSV,
    };

    this.isDeleteModalOpen = true;
  }

  // =========================================================
  // ĐÓNG XÁC NHẬN XÓA
  // =========================================================

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  // =========================================================
  // XÓA SINH VIÊN
  // =========================================================

  confirmDelete(): void {
    const code =
      this.studentToDelete.code;

    if (!code) {
      return;
    }

    const token =
      localStorage.getItem(
        'access_token'
      );

    const headers =
      new HttpHeaders({
        Authorization:
          `Bearer ${token}`,
      });

    this.http
      .delete(
        `${this.apiUrl}/${code}`,
        { headers }
      )
      .subscribe({
        next: () => {
          // Xóa khỏi danh sách gốc
          this.students =
            this.students.filter(
              (student) =>
                student.MSV !== code
            );

          // Xóa khỏi danh sách tìm kiếm
          this.filteredStudents =
            this.filteredStudents.filter(
              (student) =>
                student.MSV !== code
            );

          // Nếu xóa phần tử cuối
          // của trang hiện tại
          if (
            this.currentPage >
            this.totalPages
          ) {
            this.currentPage =
              Math.max(
                this.totalPages,
                1
              );
          }

          this.closeDeleteModal();

          this.isSuccessModalOpen = true;
        },

        error: (error) => {
          console.error(
            'Lỗi xóa sinh viên:',
            error
          );

          this.closeDeleteModal();

          this.errorMessage =
            error?.error?.message ||
            'Không thể xóa sinh viên.';
        },
      });
  }

  // =========================================================
  // ĐÓNG THÔNG BÁO THÀNH CÔNG
  // =========================================================

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
  }
}