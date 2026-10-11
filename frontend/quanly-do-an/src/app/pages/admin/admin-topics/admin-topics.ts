import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-topics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-topics.html',
  styleUrl: './admin-topics.css',
})
export class AdminTopics {
  isAddModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  isDetailModalOpen = false;

  topicToDelete = '';

  selectedTopic = {
    code: '---',
    name: '---',
    desc: '---',
    lecturer: '---',
    status: '---'
  };

  editTopicData = {
    code: '',
    name: '',
    desc: '',
    lecturer: ''
  };

  openTopicModal() {
    this.isAddModalOpen = true;
  }

  closeTopicModal() {
    this.isAddModalOpen = false;
  }

  onSubmitAddTopic(event: Event) {
    event.preventDefault();
    this.closeTopicModal();
  }

  // Mở modal Sửa
  openEditModal(code: string, name: string, desc: string, lecturer: string) {
    this.editTopicData = { code, name, desc, lecturer };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  onSubmitEditTopic(event: Event) {
    event.preventDefault();
    // Xử lý cập nhật dữ liệu đề tài tại đây
    this.closeEditModal();
  }

  // Mở modal Xóa
  openDeleteModal(code: string) {
    this.topicToDelete = code;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    // Xử lý xóa đề tài có mã `this.topicToDelete` tại đây
    this.closeDeleteModal();
  }

  openDetailModal(code: string, name: string, desc: string, lecturer: string, status: string) {
    this.selectedTopic = { code, name, desc, lecturer, status };
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
  }

}
