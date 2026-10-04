import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-registrations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-registrations.html',
  styleUrl: './admin-registrations.css',
})
export class AdminRegistrations {
  isCancelModalOpen = false;
  isSuccessModalOpen = false;

  openCancelModal() {
    this.isCancelModalOpen = true;
  }

  closeCancelModal() {
    this.isCancelModalOpen = false;
  }

  confirmCancel() {
    this.closeCancelModal();
    this.isSuccessModalOpen = true;
  }

  closeSuccessModal() {
    this.isSuccessModalOpen = false;
  }
}
