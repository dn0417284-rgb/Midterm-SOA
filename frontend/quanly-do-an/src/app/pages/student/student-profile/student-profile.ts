
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { Auth } from '../../../core/services/auth';

interface SinhVien {
  MSV: string;
  TENSV: string;
  EMAIL?: string | null;
  LOP?: string | null;
  KHOA?: string | null;
}

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css',
})
export class StudentProfile implements OnInit {

  user: SinhVien | null = null;

  isEditing = false;
  isSaving = false;
  hasChangesNow = false;

  errorMessage = '';
  successMessage = '';

  editClass = '';
  editFaculty = '';

  constructor(
    private readonly auth: Auth,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser() as SinhVien | null;
    this.syncEditData();
  }

  private displayValue(
    value: string | null | undefined,
  ): string {
    return value?.trim() || 'Chưa cập nhật';
  }

  get studentName(): string {
    return this.displayValue(this.user?.TENSV);
  }

  get studentCode(): string {
    return this.displayValue(this.user?.MSV);
  }

  get studentEmail(): string {
    return this.displayValue(this.user?.EMAIL);
  }

  get studentClass(): string {
    return this.displayValue(this.user?.LOP);
  }

  get studentFaculty(): string {
    return this.displayValue(this.user?.KHOA);
  }

  get studentAvatar(): string {
    const name = this.user?.TENSV?.trim() || '';

    if (!name) return 'SV';

    const words = name.split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  private syncEditData(): void {
    this.editClass = this.user?.LOP || '';
    this.editFaculty = this.user?.KHOA || '';
    this.hasChangesNow = false;
  }

  startEditing(): void {
    if (this.isSaving) return;

    this.syncEditData();
    this.isEditing = true;
    this.clearMessages();

    this.cdr.detectChanges();
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private checkChanges(): void {
    const oldClass = (this.user?.LOP || '').trim();
    const oldFaculty = (this.user?.KHOA || '').trim();

    this.hasChangesNow =
      this.editClass.trim() !== oldClass ||
      this.editFaculty.trim() !== oldFaculty;

    this.clearMessages();
    this.cdr.detectChanges();
  }

  onClassInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editClass = input.value;
    this.checkChanges();
  }

  onFacultyInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editFaculty = input.value;
    this.checkChanges();
  }

  cancelEditing(): void {
    if (this.isSaving) return;

    this.syncEditData();
    this.isEditing = false;
    this.clearMessages();

    this.cdr.detectChanges();
  }

  closeMessage(): void {
    this.clearMessages();
    this.cdr.detectChanges();
  }

  saveChanges(): void {
    if (this.isSaving || !this.hasChangesNow) {
      return;
    }

    const msv = this.user?.MSV?.trim();

    if (!msv) {
      this.errorMessage = 'Không xác định được mã sinh viên.';
      this.cdr.detectChanges();
      return;
    }

    const newData = {
      LOP: this.editClass.trim(),
      KHOA: this.editFaculty.trim(),
    };

    this.isSaving = true;
    this.clearMessages();
    this.cdr.detectChanges();

    this.auth.updateProfile(msv, newData).subscribe({
      next: () => {
        this.user = {
          ...this.user!,
          LOP: newData.LOP,
          KHOA: newData.KHOA,
        };

        localStorage.setItem(
          'user',
          JSON.stringify(this.user),
        );

        this.syncEditData();

        this.isEditing = false;
        this.isSaving = false;

        this.successMessage =
          'Cập nhật thông tin thành công!';

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Lỗi cập nhật hồ sơ:', error);

        this.isSaving = false;

        const message = error?.error?.message;

        this.errorMessage =
          Array.isArray(message)
            ? message.join(', ')
            : typeof message === 'string'
              ? message
              : 'Không thể cập nhật thông tin. Vui lòng thử lại.';

        this.cdr.detectChanges();
      },
    });
  }
}
