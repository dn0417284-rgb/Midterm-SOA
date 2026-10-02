import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { StudentSidebar } from '../../../components/student-sidebar/student-sidebar';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StudentSidebar],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css',
})
export class StudentLayout {
  pageTitle = 'Tổng quan sinh viên';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // 1. Lấy tiêu đề ngay lập tức khi vừa tải lại trang (F5) dựa trên URL hiện tại
    this.updateTitleFromRoute(this.activatedRoute);

    // 2. Lắng nghe sự kiện chuyển trang mượt mà khi click vào sidebar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.data['title'] || 'EduProject - Sinh viên';
      })
    ).subscribe(title => {
      this.pageTitle = title;
    });
  }

  // Hàm phụ trợ để quét và lấy title từ route hiện tại lúc load trang
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
