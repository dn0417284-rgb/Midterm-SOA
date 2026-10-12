import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  MSV: string;
  TENSV: string;
  EMAIL: string;
  MATKHAU: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    MSV: string;
    TENSV: string;
    EMAIL: string;
    VAITRO: string;
  };
}

export interface LoginRequest {
  EMAIL: string;
  MATKHAU: string;
}

export interface LoginUser {
  MSV: string;
  TENSV: string;
  EMAIL: string;
  KHOA?: string | null;
  DIEMTB?: number | null;
  LOP?: string | null;
  VAITRO: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user: LoginUser;
}

export interface UpdateProfileRequest {
  EMAIL: string;
  KHOA: string;
  LOP: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly apiUrl =
    'api/auth';

  private readonly sinhvienApiUrl =
    'api/sinhvien';

  constructor(
    private readonly http: HttpClient,
  ) {}

  // ============================
  // REGISTER
  // ============================

  register(
    data: RegisterRequest,
  ): Observable<RegisterResponse> {

    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      data,
    );
  }

  // ============================
  // LOGIN
  // ============================

  login(
    data: LoginRequest,
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data,
    );
  }

  // ============================
  // LƯU SESSION
  // ============================

  saveSession(
    response: LoginResponse,
  ): void {

    localStorage.setItem(
      'access_token',
      response.access_token,
    );

    localStorage.setItem(
      'user',
      JSON.stringify(response.user),
    );
  }

  // ============================
  // CẬP NHẬT PROFILE
  // ============================

  updateProfile(
    msv: string,
    data: UpdateProfileRequest,
  ): Observable<LoginUser> {

    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<LoginUser>(
      `${this.sinhvienApiUrl}/${msv}`,
      data,
      {
        headers,
      },
    );
  }

  // ============================
  // TOKEN
  // ============================

  getToken(): string | null {

    return localStorage.getItem(
      'access_token',
    );
  }

  // ============================
  // USER
  // ============================

  getUser(): LoginUser | null {

    const user =
      localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as LoginUser;
    } catch {
      return null;
    }
  }

  // ============================
  // LOGOUT
  // ============================

  logout(): void {

    localStorage.removeItem(
      'access_token',
    );

    localStorage.removeItem(
      'user',
    );
  }

  // ============================
  // KIỂM TRA ĐĂNG NHẬP
  // ============================

  isLoggedIn(): boolean {

    return !!this.getToken();
  }
}
