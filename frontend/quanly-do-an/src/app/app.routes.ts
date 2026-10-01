import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(
        (m) => m.Login
      ),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(
        (m) => m.Register
      ),
  },

  {
    path: 'dashboard/admin',
    loadComponent: () =>
      import('./pages/dashboard/admin-dashboard/admin-dashboard').then(
        (m) => m.AdminDashboard
      ),
  },

  {
    path: 'dashboard/student',
    loadComponent: () =>
      import('./pages/dashboard/student-dashboard/student-dashboard').then(
        (m) => m.StudentDashboard
      ),
  },
];