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

  selectedStudent = {
    name: '---',
    code: '---',
    email: '---',
    studentClass: '---',
    major: '---'
  };

  openModal(name: string, code: string, email: string, studentClass: string, major: string) {
    this.selectedStudent = { name, code, email, studentClass, major };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
