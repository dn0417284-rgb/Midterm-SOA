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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // Lắng nghe sự kiện đổi trang để cập nhật tiêu đề ngay lập tức
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
}
