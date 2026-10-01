import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-topics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-topics.html',
  styleUrl: './admin-topics.css',
})
export class AdminTopics {
  isAddModalOpen = false;
  isDetailModalOpen = false;

  selectedTopic = {
    code: '---',
    name: '---',
    desc: '---',
    lecturer: '---',
    status: '---'
  };

  openTopicModal() {
    this.isAddModalOpen = true;
  }

  closeTopicModal() {
    this.isAddModalOpen = false;
  }

  openDetailModal(code: string, name: string, desc: string, lecturer: string, status: string) {
    this.selectedTopic = { code, name, desc, lecturer, status };
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
  }

  onSubmitAddTopic(event: Event) {
    event.preventDefault();
    // Xử lý logic lưu đề tài ở đây
    this.closeTopicModal();
  }

}
