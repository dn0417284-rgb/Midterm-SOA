import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Detai, DetaiService } from '../../../core/services/detai';
import { FormsModule } from '@angular/forms';

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
  isAddTopicModalOpen = false;
  isAddSuccessModalOpen = false;
  isRegisterSuccessModalOpen = false;
  constructor(private detaiService: DetaiService) {}

  ngOnInit(): void {
    this.loadTopics();
  }
  loadTopics(): void {
    this.detaiService.getAll().subscribe({
      next: (data) => {
        this.topics = data;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách đề tài:', err);
      },
    });
  }
  // Modal thêm đề tài
  openAddTopicModal() {
    this.isAddTopicModalOpen = true;
  }
  closeAddTopicModal() {
    this.isAddTopicModalOpen = false;
  }
  submitAddTopic(event: Event) {
    event.preventDefault();

    const newTopic: Detai = {
      MDT: 0,
      name: this.editTopicData.name ?? '',
      desc: this.editTopicData.desc ?? '',
      lecturer: this.editTopicData.lecturer ?? '',
      status: 0,
    };

    this.detaiService.add(newTopic).subscribe({
      next: (data) => {
        console.log('Thêm đề tài thành công:', data);

        this.loadTopics();
        this.closeAddTopicModal();
        this.isAddSuccessModalOpen = true;
      },

      error: (error) => {
        console.error('Lỗi khi thêm đề tài:', error);
      },
    });
  }
  closeAddSuccessModal() {
    this.isAddSuccessModalOpen = false;
  }

  // Đăng ký đề tài
  registerTopic(topic: Detai) {}
  closeRegisterSuccessModal() {
    this.isRegisterSuccessModalOpen = false;
  }
  openRegisterSuccessModal() {}
  // Bộ lọc
  get filteredTopics(): Detai[] {
    const keyword = this.searchText.trim().toLowerCase();
    return this.topics.filter((t) => {
      const matchSearch =
        !keyword || t.name.toLowerCase().includes(keyword) || t.MDT.toString().includes(keyword);
      // Lọc trạng thái
      const matchStatus = !this.filterStatus || t.status.toString() === this.filterStatus;

      // Lọc giảng viên
      const matchLecturer = !this.filterLecturer || t.lecturer === this.filterLecturer;

      return matchSearch && matchStatus && matchLecturer;
    });
  }
  getStatusText(status: number): string {
    return status === 1 ? 'Đã đăng ký' : 'Chưa đăng ký';
  }

  getStatusClass(status: number): string {
    return status === 1 ? 'badge badge-danger' : 'badge badge-success';
  }
}
