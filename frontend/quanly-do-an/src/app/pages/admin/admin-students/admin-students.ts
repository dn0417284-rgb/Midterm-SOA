
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

interface Student {
  MSV: string;
  TENSV: string;
  EMAIL: string;
  KHOA: string | null;
  LOP: string | null;
  DIEMTB: number | null;
  VAITRO: string;
}

interface StudentForm {
  MSV: string;
  TENSV: string;
  EMAIL: string;
  MATKHAU: string;
  KHOA: string;
  LOP: string;
  DIEMTB: number | null;
}

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-students.html',
  styleUrl: './admin-students.css',
})
export class AdminStudents implements OnInit {

  // Đường dẫn API qua Angular proxy
  private readonly apiUrl = '/api/sinhvien';

  // Danh sách sinh viên
  students: Student[] = [];
  filteredStudents: Student[] = [];

  // Tìm kiếm
  searchKeyword = '';

  // Trạng thái
  isLoading = true;
  isSaving = false;
  isDeleting = false;
  errorMessage = '';
  formError = '';
  successMessage = '';

  // Phân trang
  currentPage = 1;
  pageSize = 10;

  // Popup
  isModalOpen = false;
  isDeleteModalOpen = false;
  isSuccessModalOpen = false;
  isFormModalOpen = false;

  // Chế độ form: thêm hoặc sửa
  formMode: 'add' | 'edit' = 'add';

  selectedStudent: Student | null = null;
  originalStudent: Student | null = null;

  studentToDelete = {
    code: '',
    name: '',
  };

  // Dữ liệu form
  studentForm: StudentForm = this.emptyForm();

  constructor(
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  // =====================================
  // FORM RỖNG
  // =====================================

  emptyForm(): StudentForm {
    return {
      MSV: '',
      TENSV: '',
      EMAIL: '',
      MATKHAU: '',
      KHOA: '',
      LOP: '',
      DIEMTB: null,
    };
  }

  // =====================================
  // HEADER JWT
  // =====================================

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
    });
  }

  // =====================================
  // LẤY DANH SÁCH SINH VIÊN
  // =====================================

  loadStudents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<Student[]>(
      this.apiUrl,
      { headers: this.getHeaders() },
    ).subscribe({
      next: (data) => {
        // Chỉ hiển thị tài khoản sinh viên
        this.students = Array.isArray(data)
          ? data.filter(
              (student) => student.VAITRO === 'SINHVIEN'
            )
          : [];

        this.searchStudents();
        this.isLoading = false;

        // Cập nhật giao diện ngay
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Lỗi tải sinh viên:', error);

        this.students = [];
        this.filteredStudents = [];
        this.isLoading = false;

        this.errorMessage =
          error?.error?.message ||
          'Không thể tải danh sách sinh viên.';

        this.cdr.detectChanges();
      },
    });
  }

  // =====================================
  // TÌM KIẾM
  // =====================================
  normalizeText(value: string | null | undefined): string {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  
searchStudents(): void {
  const keyword = this.normalizeText(this.searchKeyword);

  this.filteredStudents = this.students.filter((student) => {
    const content = [
      student.MSV,
      student.TENSV,
      student.EMAIL,
      student.KHOA,
      student.LOP,
    ].map(value => this.normalizeText(value)).join(' ');

    return content.includes(keyword);
  });

  this.currentPage = 1;
}


  // =====================================
  // PHÂN TRANG
  // =====================================

  get paginatedStudents(): Student[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredStudents.slice(
      start,
      start + this.pageSize,
    );
  }

  get totalPages(): number {
    return Math.ceil(
      this.filteredStudents.length / this.pageSize,
    );
  }

  get pageNumbers(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 0) {
      return [];
    }

    if (total <= 7) {
      return Array.from(
        { length: total },
        (_, index) => index + 1,
      );
    }

    const pages: (number | string)[] = [1];

    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }

    if (current >= total - 3) {
      return [
        1,
        '...',
        total - 4,
        total - 3,
        total - 2,
        total - 1,
        total,
      ];
    }

    pages.push(
      '...',
      current - 1,
      current,
      current + 1,
      '...',
      total,
    );

    return pages;
  }

  goToPage(page: number | string): void {
    if (typeof page !== 'number') {
      return;
    }

    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get startItem(): number {
    if (this.isLoading || this.filteredStudents.length === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    if (this.isLoading || this.filteredStudents.length === 0) {
      return 0;
    }

    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredStudents.length,
    );
  }

  // =====================================
  // XEM CHI TIẾT
  // =====================================

  openModal(student: Student): void {
    this.selectedStudent = student;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedStudent = null;
  }

  // =====================================
  // MỞ POPUP THÊM SINH VIÊN
  // =====================================

  openAddModal(): void {
    this.formMode = 'add';
    this.studentForm = this.emptyForm();
    this.formError = '';
    this.isSaving = false;
    this.isFormModalOpen = true;
  }

  // =====================================
  // MỞ POPUP SỬA SINH VIÊN
  // =====================================

  openEditModal(student: Student): void {
    this.formMode = 'edit';

    this.originalStudent = { ...student };

    this.studentForm = {
      MSV: student.MSV,
      TENSV: student.TENSV,
      EMAIL: student.EMAIL,
      MATKHAU: '',
      KHOA: student.KHOA || '',
      LOP: student.LOP || '',
      DIEMTB: student.DIEMTB,
    };

    this.formError = '';
    this.isSaving = false;
    this.isFormModalOpen = true;
  }

  // =====================================
  // ĐÓNG POPUP THÊM / SỬA
  // =====================================

  closeFormModal(): void {
    if (this.isSaving) {
      return;
    }

    this.isFormModalOpen = false;
    this.formError = '';
  }

  // =====================================
  // KIỂM TRA DỮ LIỆU FORM
  // =====================================

  
  validateForm(): boolean {
    const form = this.studentForm;

    if (this.formMode === 'add') {
      if (
        !form.MSV.trim() ||
        !form.TENSV.trim() ||
        !form.EMAIL.trim() ||
        !form.MATKHAU.trim()
      ) {
        this.formError =
          'Vui lòng nhập Mã sinh viên, Họ tên, Email và Mật khẩu.';
        return false;
      }

      if (form.MATKHAU.length < 8) {
        this.formError = 'Mật khẩu phải có ít nhất 8 ký tự.';
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.EMAIL.trim())) {
      this.formError = 'Email không hợp lệ.';
      return false;
    }

    if (form.KHOA.length > 100) {
      this.formError = 'Tên khoa không được quá 100 ký tự.';
      return false;
    }

    if (form.LOP.length > 50) {
      this.formError = 'Tên lớp không được quá 50 ký tự.';
      return false;
    }

    this.formError = '';
    return true;
  }


  // =====================================
  // LƯU THÊM / SỬA
  // =====================================

  saveStudent(): void {
    if (this.isSaving || !this.validateForm()) {
      return;
    }

    this.isSaving = true;
    this.formError = '';

    if (this.formMode === 'add') {
      this.addStudent();
    } else {
      this.updateStudent();
    }
  }

  // =====================================
  // THÊM SINH VIÊN
  // =====================================

  
  addStudent(): void {
    const form = this.studentForm;

    const body = {
      MSV: form.MSV.trim(),
      TENSV: form.TENSV.trim(),
      EMAIL: form.EMAIL.trim(),
      MATKHAU: form.MATKHAU,
      KHOA: form.KHOA.trim(),
      LOP: form.LOP.trim(),
    };

    this.http.post<Student>(
      this.apiUrl,
      body,
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.isFormModalOpen = false;

        this.successMessage = 'Thêm sinh viên thành công!';
        this.isSuccessModalOpen = true;

        this.loadStudents();

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Lỗi thêm sinh viên:', error);

        this.isSaving = false;

        const message = error?.error?.message;

        this.formError = Array.isArray(message)
          ? message.join(', ')
            : typeof message === 'string'
              ? message
              : 'Không thể thêm sinh viên.';

          this.cdr.detectChanges();
      },
      });
    }


  // =====================================
  // CẬP NHẬT SINH VIÊN
  // =====================================

  updateStudent(): void {
    const form = this.studentForm;
    const original = this.originalStudent;

    if (!original) {
      this.formError = 'Không tìm thấy thông tin sinh viên cần sửa.';
      this.isSaving = false;
      return;
    }

    const body: {
      KHOA?: string | null;
      LOP?: string | null;
    } = {};

    const newKhoa = form.KHOA.trim();
    const newLop = form.LOP.trim();

    if (newKhoa !== (original.KHOA || '').trim()) {
      body.KHOA = newKhoa || null;
    }

    if (newLop !== (original.LOP || '').trim()) {
      body.LOP = newLop || null;
    }

    if (Object.keys(body).length === 0) {
      this.formError = 'Bạn chưa thay đổi thông tin nào.';
      this.isSaving = false;
      return;
    }

    const msv = encodeURIComponent(form.MSV);

    this.http.put(
      `${this.apiUrl}/${msv}`,
      body,
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.isFormModalOpen = false;

        this.successMessage = 'Cập nhật sinh viên thành công!';
        this.isSuccessModalOpen = true;

        this.loadStudents();

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Lỗi cập nhật sinh viên:', error);

        this.isSaving = false;

        const message = error?.error?.message;

        if (Array.isArray(message)) {
          this.formError = message.join(', ');
        } else if (
          typeof message === 'string' &&
          message !== 'Internal server error'
        ) {
          this.formError = message;
        } else if (error.status === 500) {
          this.formError =
            'Máy chủ gặp lỗi khi lưu dữ liệu. Vui lòng kiểm tra log Sinhvien Service.';
        } else if (error.status === 403) {
          this.formError = 'Bạn không có quyền cập nhật sinh viên.';
        } else if (error.status === 401) {
          this.formError = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.status === 0) {
          this.formError = 'Không thể kết nối đến máy chủ.';
        } else {
          this.formError = 'Không thể cập nhật sinh viên.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  // =====================================
  // MỞ POPUP XÓA
  // =====================================

  openDeleteModal(student: Student): void {
    this.studentToDelete = {
      code: student.MSV,
      name: student.TENSV,
    };

    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    if (this.isDeleting) {
      return;
    }

    this.isDeleteModalOpen = false;
  }

  // =====================================
  // XÓA SINH VIÊN
  // =====================================

  confirmDelete(): void {
    const code = this.studentToDelete.code;

    if (!code || this.isDeleting) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    const msv = encodeURIComponent(code);

    this.http.delete(
      `${this.apiUrl}/${msv}`,
      { headers: this.getHeaders() },
    ).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteModalOpen = false;

        this.successMessage = 'Xóa sinh viên thành công!';
        this.isSuccessModalOpen = true;

        this.loadStudents();
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Lỗi xóa sinh viên:', error);

        this.isDeleting = false;
        this.isDeleteModalOpen = false;

        this.errorMessage =
          error?.error?.message ||
          'Không thể xóa sinh viên.';

        this.cdr.detectChanges();
      },
    });
  }

  // =====================================
  // ĐÓNG POPUP THÀNH CÔNG
  // =====================================

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
    this.successMessage = '';
  }

  
  // Đóng popup chi tiết khi nhấn nền bên ngoài
  closeDetailOutside(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  // Đóng popup thêm / sửa khi nhấn nền bên ngoài
  closeFormOutside(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isSaving) {
      this.closeFormModal();
    }
  }

  // Đóng popup xóa khi nhấn nền bên ngoài
  closeDeleteOutside(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isDeleting) {
      this.closeDeleteModal();
    }
  }

  // Đóng thông báo thành công khi nhấn nền bên ngoài
  closeSuccessOutside(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeSuccessModal();
    }
  }

}
