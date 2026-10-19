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
  LOP: string;
  KHOA: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = '/api/auth';

  private readonly sinhvienApiUrl = '/api/sinhvien';

  constructor(private readonly http: HttpClient) {}

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  saveSession(response: LoginResponse): void {
    localStorage.setItem('access_token', response.access_token);

    localStorage.setItem('user', JSON.stringify(response.user));
  }

  updateProfile(msv: string, data: UpdateProfileRequest): Observable<LoginUser> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
      'Content-Type': 'application/json',
    });

    const updateData: UpdateProfileRequest = {
      LOP: data.LOP,
      KHOA: data.KHOA,
    };

    return this.http.put<LoginUser>(
      `${this.sinhvienApiUrl}/${encodeURIComponent(msv)}`,
      updateData,
      {
        headers,
      },
    );
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser(): LoginUser | null {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as LoginUser;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');

    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
