import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  Character,
} from 'src/app/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeListService {
  private baseUrl = environment.baseUrl;

  constructor(private _httpClient: HttpClient) {}

  getAllList(): Observable<ApiResponse> {
    return this._httpClient.get<ApiResponse>(`${this.baseUrl}/character`);
  }

  getById(id: number): Observable<Character> {
    return this._httpClient.get<Character>(`${this.baseUrl}/character/${id}`);
  }

  getByName(name: string): Observable<ApiResponse> {
    return this._httpClient.get<ApiResponse>(
      `${this.baseUrl}/character/?name=${name}`
    );
  }

  getByUrl(url: string): Observable<ApiResponse> {
    return this._httpClient.get<ApiResponse>(url);
  }
}
