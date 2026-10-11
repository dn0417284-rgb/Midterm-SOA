import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Detai, DetaiService } from '../../../core/services/detai';

@Component({
  selector: 'app-admin-topics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-topics.html',
  styleUrl: './admin-topics.css',
})
export class AdminTopics implements OnInit {
  topics: Detai[] = [];

  isAddModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  isDetailModalOpen = false;

  topicToDelete: number | null = null;
  selectedTopic: Detai | null = null;

  editTopicData: Partial<Detai> = {};

  searchText = '';
  filterStatus = '';
  filterLecturer = '';

  constructor(
    private detaiService: DetaiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTopics();
  }
  loadTopics(): void {
    this.detaiService.getAll().subscribe({
      next: (data) => {
        this.topics = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách đề tài:', err);
      },
    });
  }

  openTopicModal(): void {
    this.editTopicData = {};
    this.isAddModalOpen = true;
  }

  closeTopicModal(): void {
    this.isAddModalOpen = false;
    this.editTopicData = {};
  }

  onSubmitAddTopic(event: Event): void {
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
        this.loadTopics();
        this.closeTopicModal();
      },

      error: (error) => {
        console.error('Lỗi khi thêm đề tài:', error);
      },
    });
  }

  openEditModal(MDT: number, name: string, desc: string, lecturer: string): void {
    this.editTopicData = {
      MDT,
      name,
      desc,
      lecturer,
    };

    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editTopicData = {};
  }

  onSubmitEditTopic(event: Event): void {
    event.preventDefault();

    if (this.editTopicData.MDT == null) {
      console.error('Không có mã đề tài để cập nhật');
      return;
    }

    this.detaiService.update(this.editTopicData.MDT, this.editTopicData).subscribe({
      next: (data) => {
        this.loadTopics();
        this.closeEditModal();
      },

      error: (error) => {
        console.error('Lỗi khi cập nhật đề tài:', error);
      },
    });
  }

  openDeleteModal(MDT: number): void {
    this.topicToDelete = MDT;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.topicToDelete = null;
  }

  confirmDelete(): void {
    if (this.topicToDelete == null) {
      return;
    }

    this.detaiService.delete(this.topicToDelete).subscribe({
      next: (data) => {
        this.loadTopics();
        this.closeDeleteModal();
      },

      error: (error) => {
        console.error('Lỗi khi xóa đề tài:', error);
      },
    });
  }

  openDetailModal(MDT: number, name: string, desc: string, lecturer: string, status: number): void {
    this.selectedTopic = {
      MDT,
      name,
      desc,
      lecturer,
      status,
    };

    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedTopic = null;
  }

  get filteredTopics(): Detai[] {
    return this.topics.filter((topic) => {
      // Tìm theo tên hoặc mã đề tài
      const keyword = this.searchText.trim().toLowerCase();

      const matchSearch =
        !keyword ||
        topic.name.toLowerCase().includes(keyword) ||
        topic.MDT.toString().includes(keyword);

      // Lọc trạng thái
      const matchStatus = !this.filterStatus || topic.status.toString() === this.filterStatus;

      // Lọc giảng viên
      const matchLecturer = !this.filterLecturer || topic.lecturer === this.filterLecturer;

      return matchSearch && matchStatus && matchLecturer;
    });
  }

  getStatusText(status: number): string {
    return status === 0 ? 'Chưa đăng ký' : 'Đã đăng ký';
  }

  
  // ==========================
  // PHÂN TRANG
  // ==========================

  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];

  get lecturers(): string[] {
    return [
      ...new Set(
        this.topics
          .map((topic) => topic.lecturer)
          .filter((name) => !!name),
      ),
    ];
  }

  get totalItems(): number {
    return this.filteredTopics.length;
  }

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.totalItems / this.pageSize),
    );
  }

  get paginatedTopics(): Detai[] {
    const page = Math.min(this.currentPage, this.totalPages);
    const start = (page - 1) * this.pageSize;

    return this.filteredTopics.slice(
      start,
      start + this.pageSize,
    );
  }

  get startItem(): number {
    if (this.totalItems === 0) return 0;

    return (
      (Math.min(this.currentPage, this.totalPages) - 1)
      * this.pageSize + 1
    );
  }

  get endItem(): number {
    return Math.min(
      Math.min(this.currentPage, this.totalPages)
      * this.pageSize,
      this.totalItems,
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

}