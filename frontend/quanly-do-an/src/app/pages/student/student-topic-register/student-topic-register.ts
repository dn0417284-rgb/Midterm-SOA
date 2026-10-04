import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-student-topic-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-topic-register.html',
  styleUrl: './student-topic-register.css',
})
export class StudentTopicRegister {
  isAddTopicModalOpen = false;
  isAddSuccessModalOpen = false;
  isRegisterSuccessModalOpen = false;

  openAddTopicModal() {
    this.isAddTopicModalOpen = true;
  }

  closeAddTopicModal() {
    this.isAddTopicModalOpen = false;
  }

  submitAddTopic(event: Event) {
    event.preventDefault();
    this.closeAddTopicModal();
    this.isAddSuccessModalOpen = true;
  }

  closeAddSuccessModal() {
    this.isAddSuccessModalOpen = false;
  }

  openRegisterSuccessModal() {
    this.isRegisterSuccessModalOpen = true;
  }

  closeRegisterSuccessModal() {
    this.isRegisterSuccessModalOpen = false;
  }
}
