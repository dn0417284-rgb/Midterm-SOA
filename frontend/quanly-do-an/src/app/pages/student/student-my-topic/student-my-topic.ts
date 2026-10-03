import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-student-my-topic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-my-topic.html',
  styleUrl: './student-my-topic.css',
})
export class StudentMyTopic {
isCancelModalOpen = false;
  isSuccessModalOpen = false;
  hasTopic = true;

  openCancelModal() {
    this.isCancelModalOpen = true;
  }

  closeCancelModal() {
    this.isCancelModalOpen = false;
  }

  confirmCancel() {
    this.closeCancelModal();
    this.isSuccessModalOpen = true;
    this.hasTopic = false; // Ẩn thẻ đề tài đi sau khi hủy thành công
  }

  closeSuccessModal() {
    this.isSuccessModalOpen = false;
  }
}
