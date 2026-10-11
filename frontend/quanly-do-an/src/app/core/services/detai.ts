
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Detai {
  MDT: number;
  name: string;
  desc: string;
  lecturer: string;
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class DetaiService {
  private apiUrl = '/api/detai';

  constructor(private http: HttpClient) {}

  // Lấy token đăng nhập
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });
  }

  // Chuyển dữ liệu Backend sang Frontend
  private mapDetai(item: any): Detai {
    return {
      MDT: item.MDT,
      name: item.tenDetai,
      desc: item.moTa,
      lecturer: item.giangVienHuongDan,
      status: item.trangThai,
    };
  }

  // Lấy danh sách đề tài
  getAll(): Observable<Detai[]> {
    return this.http
      .get<any[]>(this.apiUrl, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((data) =>
          data.map((item) => this.mapDetai(item)),
        ),
      );
  }

  // Lấy chi tiết đề tài
  getByCode(MDT: number): Observable<Detai> {
    return this.http
      .get<any>(`${this.apiUrl}/${MDT}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((data) => this.mapDetai(data)));
  }

  // Thêm đề tài
  add(detai: Detai): Observable<Detai> {
    const body = {
      tenDetai: detai.name,
      moTa: detai.desc,
      giangVienHuongDan: detai.lecturer,
      trangThai: detai.status,
    };

    return this.http
      .post<any>(this.apiUrl, body, {
        headers: this.getHeaders(),
      })
      .pipe(map((data) => this.mapDetai(data)));
  }

  // Cập nhật đề tài
  update(
    MDT: number,
    detai: Partial<Detai>,
  ): Observable<Detai> {
    const body = {
      ...(detai.name !== undefined && {
        tenDetai: detai.name,
      }),
      ...(detai.desc !== undefined && {
        moTa: detai.desc,
      }),
      ...(detai.lecturer !== undefined && {
        giangVienHuongDan: detai.lecturer,
      }),
      ...(detai.status !== undefined && {
        trangThai: detai.status,
      }),
    };

    return this.http
      .put<any>(`${this.apiUrl}/${MDT}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(map((data) => this.mapDetai(data)));
  }

  // Xóa đề tài
  delete(MDT: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${MDT}`,
      {
        headers: this.getHeaders(),
      },
    );
  }
}
