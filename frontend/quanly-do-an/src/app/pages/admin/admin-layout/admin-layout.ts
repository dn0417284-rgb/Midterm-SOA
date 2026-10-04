import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';

import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';

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
export class AdminLayout
  implements OnInit, OnDestroy {

  pageTitle = 'Tổng quan hệ thống';

  private readonly destroy$ =
    new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  // ============================
  // KHỞI TẠO
  // ============================

  ngOnInit(): void {

    this.updateTitleFromRoute(
      this.activatedRoute,
    );

    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd,
        ),

        map(() => {

          let route =
            this.activatedRoute;

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

  // ============================
  // LẤY TITLE BAN ĐẦU
  // ============================

  private updateTitleFromRoute(
    route: ActivatedRoute,
  ): void {

    let activeRoute = route;

    while (activeRoute.firstChild) {
      activeRoute =
        activeRoute.firstChild;
    }

    const title =
      activeRoute.snapshot.data['title'];

    if (title) {

      this.pageTitle = title;

    }
  }

  // ============================
  // HỦY SUBSCRIPTION
  // ============================

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();
  }
}
