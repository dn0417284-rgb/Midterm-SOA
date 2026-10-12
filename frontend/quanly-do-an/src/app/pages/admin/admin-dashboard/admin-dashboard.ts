
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

  // ============================
  // THỐNG KÊ
  // ============================

  totalStudents = 524;
  totalTeachers = 84;
  registeredTopics = 95;
  unregisteredTopics = 33;

  // ============================
  // DANH SÁCH ĐỀ TÀI MỚI
  // ============================

  recentTopics = [
    {
      name: 'Ứng dụng AI trong giáo dục',
      description:
        'Nghiên cứu và phát triển hệ thống hỗ trợ học tập thông minh.',
      teacher: 'TS. Trần Văn B',
      status: 'Mới cập nhật',
    },
    {
      name: 'Website thương mại điện tử',
      description:
        'Xây dựng nền tảng bán hàng trực tuyến với tích hợp thanh toán.',
      teacher: 'ThS. Phạm Văn D',
      status: 'Mới cập nhật',
    },
    {
      name: 'Ứng dụng di động quản lý sức khỏe',
      description:
        'Giúp người dùng theo dõi chế độ ăn uống và tập luyện.',
      teacher: 'TS. Hoàng Văn F',
      status: 'Mới cập nhật',
    },
  ];
}
