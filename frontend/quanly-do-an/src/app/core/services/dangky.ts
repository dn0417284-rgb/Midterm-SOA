
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DangKy {
  detaiId: number;
  MSV: string;
  TRANG_THAI: string;
  NGAY_DANG_KY?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DangKyService {
  private apiUrl = '/api/dangky';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') ?? '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Lấy danh sách đăng ký của sinh viên
  getBySinhVien(msv: string): Observable<DangKy[]> {
    return this.http.get<DangKy[]>(
      `${this.apiUrl}/sinhvien/${encodeURIComponent(msv)}`,
      { headers: this.getHeaders() },
    );
  }

  // Hủy đăng ký theo mã đề tài và mã sinh viên
  cancelRegistration(
    detaiId: number,
    msv: string,
  ): Observable<unknown> {
    return this.http.delete(
      `${this.apiUrl}/${detaiId}/${encodeURIComponent(msv)}`,
      { headers: this.getHeaders() },
    );
  }

  
registerTopic(detaiId: number): Observable<unknown> {
  return this.http.post(
    this.apiUrl,
    { detaiId },
    { headers: this.getHeaders() },
  );
}

}
