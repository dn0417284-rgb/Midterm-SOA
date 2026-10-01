import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

export interface LoginResponse {
  message: string;
  access_token: string;

  user: {
    MSV: string;
    TENSV: string;
    EMAIL: string;
    VAITRO: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl =
    'http://localhost:3001/auth';

  constructor(
    private readonly http: HttpClient,
  ) {}

  register(
    data: RegisterRequest,
  ): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      data,
    );
  }

  login(
    data: LoginRequest,
  ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data,
    );
  }

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

  getToken(): string | null {
    return localStorage.getItem(
      'access_token',
    );
  }

  getUser():
    LoginResponse['user'] | null {
    const user =
      localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  logout(): void {
    localStorage.removeItem(
      'access_token',
    );

    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}