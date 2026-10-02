import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebar, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  pageTitle = 'Tổng quan hệ thống';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // 1. Lấy tiêu đề ngay lúc vừa tải lại trang (F5) dựa trên URL hiện tại
    this.updateTitleFromRoute(this.activatedRoute);

    // 2. Lắng nghe sự kiện chuyển trang khi click vào sidebar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.data['title'] || 'Quản lý Đồ án Tốt nghiệp';
      })
    ).subscribe(title => {
      this.pageTitle = title;
    });
  }

  // Hàm phụ trợ để quét và lấy title từ route hiện tại khi load trang
  private updateTitleFromRoute(route: ActivatedRoute) {
    let activeRoute = route;
    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }
    if (activeRoute.snapshot.data['title']) {
      this.pageTitle = activeRoute.snapshot.data['title'];
    }
  }
}
