import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

// Admin Pages & Layout
import { AdminLayout } from './pages/admin/admin-layout/admin-layout';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { AdminStudents } from './pages/admin/admin-students/admin-students';
import { AdminTopics } from './pages/admin/admin-topics/admin-topics';
import { AdminRegistrations } from './pages/admin/admin-registrations/admin-registrations';

// Student Pages & Layout
import { StudentLayout } from './pages/student/student-layout/student-layout';
import { StudentDashboard } from './pages/student/student-dashboard/student-dashboard';
import { StudentProfile } from './pages/student/student-profile/student-profile';
import { StudentTopicRegister } from './pages/student/student-topic-register/student-topic-register';

export const routes: Routes = [
    // 1. Trang chủ và Xác thực
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },

    // 2. Phân vùng Admin (có Layout chứa Sidebar chung)
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            { path: 'dashboard', component: AdminDashboard },
            { path: 'students', component: AdminStudents },
            { path: 'topics', component: AdminTopics },
            { path: 'registrations', component: AdminRegistrations },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // 3. Phân vùng Sinh viên (có Layout chứa Sidebar chung)
    {
        path: 'student',
        component: StudentLayout,
        children: [
            { path: 'dashboard', component: StudentDashboard },
            { path: 'profile', component: StudentProfile },
            { path: 'register-topic', component: StudentTopicRegister },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // 4. Đường dẫn không hợp lệ sẽ quay về trang chủ
    { path: '**', redirectTo: '' }
];
