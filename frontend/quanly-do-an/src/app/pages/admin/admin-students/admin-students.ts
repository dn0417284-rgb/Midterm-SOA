import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-students.html',
  styleUrl: './admin-students.css',
})
export class AdminStudents {
  isModalOpen = false;
  isDeleteModalOpen = false;
  isSuccessModalOpen = false;

  selectedStudent = {
    name: '',
    code: '',
    email: '',
    studentClass: '',
    major: ''
  };

  studentToDelete = {
    code: '',
    name: ''
  };

  // Mở modal Chi tiết
  openModal(name: string, code: string, email: string, studentClass: string, major: string) {
    this.selectedStudent = { name, code, email, studentClass, major };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Mở modal Xác nhận Xóa
  openDeleteModal(code: string, name: string) {
    this.studentToDelete = { code, name };
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  // Xác nhận xóa -> Đóng modal xác nhận, mở modal thông báo thành công
  confirmDelete() {
    this.closeDeleteModal();
    this.isSuccessModalOpen = true;
  }

  closeSuccessModal() {
    this.isSuccessModalOpen = false;
  }
}
