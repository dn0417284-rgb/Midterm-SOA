
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';

import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import { Auth, LoginUser } from '../../../core/services/auth';

import {
  Subject,
  filter,
  map,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AdminSidebar,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit, OnDestroy {

  pageTitle = 'Tổng quan hệ thống';

  currentUser: LoginUser | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly auth: Auth,
  ) {}

  ngOnInit(): void {

    // Lấy thông tin tài khoản đã đăng nhập
    this.currentUser = this.auth.getUser();

    // Lấy tiêu đề trang hiện tại
    this.updateTitleFromRoute(this.activatedRoute);

    this.router.events
      .pipe(
        filter(
          (event) => event instanceof NavigationEnd,
        ),
        map(() => {
          let route = this.activatedRoute;

          while (route.firstChild) {
            route = route.firstChild;
          }

          return (
            route.snapshot.data['title'] ??
            'Quản lý Đồ án Tốt nghiệp'
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((title) => {
        this.pageTitle = title;
      });
  }

  get userName(): string {
    return this.currentUser?.TENSV || 'Người dùng';
  }

  get userRole(): string {
    if (this.currentUser?.VAITRO === 'ADMIN') {
      return 'Quản trị viên';
    }

    if (this.currentUser?.VAITRO === 'SINHVIEN') {
      return 'Sinh viên';
    }

    return 'Chưa xác định';
  }

  get userAvatar(): string {
    const name = this.userName.trim();

    if (!name || name === 'Người dùng') {
      return 'ND';
    }

    const words = name.split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  private updateTitleFromRoute(
    route: ActivatedRoute,
  ): void {

    let activeRoute = route;

    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    const title = activeRoute.snapshot.data['title'];

    if (title) {
      this.pageTitle = title;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
