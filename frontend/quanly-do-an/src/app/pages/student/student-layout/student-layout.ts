import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';
import { StudentSidebar } from '../../../components/student-sidebar/student-sidebar';
import { filter, map } from 'rxjs';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    StudentSidebar
  ],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css',
})
export class StudentLayout {

  pageTitle = 'Tổng quan sinh viên';

  // Thông tin sinh viên đăng nhập
  user: any = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: Auth
  ) {}

  ngOnInit() {

    // Lấy thông tin người dùng đã đăng nhập
    this.user = this.auth.getUser();

    // Lấy title khi F5
    this.updateTitleFromRoute(this.activatedRoute);

    // Theo dõi khi chuyển trang
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {

        let route = this.activatedRoute;

        while (route.firstChild) {
          route = route.firstChild;
        }

        return route.snapshot.data['title']
          || 'EduProject - Sinh viên';
      })
    ).subscribe(title => {
      this.pageTitle = title;
    });
  }

  // ============================
  // THÔNG TIN SINH VIÊN
  // ============================

  // Tên sinh viên
  get studentName(): string {
    return this.user?.TENSV || '';
  }

  // Mã sinh viên
  get studentCode(): string {
    return this.user?.MSV || '';
  }

  // Khoa
  get studentFaculty(): string {
    return this.user?.KHOA || '';
  }

  // Điểm trung bình
  get studentGPA(): string {
    return this.user?.DIEMTB || '';
  }

  // Lớp
  get studentClass(): string {
    return this.user?.LOP || '';
  }

  // Email
  get studentEmail(): string {
    return this.user?.EMAIL || '';
  }

  // Vai trò
  get studentRole(): string {
    return this.user?.VAITRO || '';
  }

  // Tạo avatar từ TENSV
  get studentAvatar(): string {

    const name = this.studentName.trim();

    if (!name) {
      return '';
    }

    const words = name.split(/\s+/);

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  // Lấy title từ route
  private updateTitleFromRoute(route: ActivatedRoute) {

    let activeRoute = route;

    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    if (activeRoute.snapshot.data['title']) {
      this.pageTitle =
        activeRoute.snapshot.data['title'];
    }
  }
}
