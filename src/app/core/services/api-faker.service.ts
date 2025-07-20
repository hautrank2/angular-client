import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import {
  ApiPaginationQuery,
  PaginationResponse,
  HttpPostOptions,
} from './crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiFakerService<T> {
  constructor(private http: HttpClient) {}

  find(
    endpoint: string,
    params: ApiPaginationQuery,
  ): Observable<PaginationResponse<T>> {
    const { page, pageSize } = params;
    return this.http
      .get<T[]>(endpoint, {
        params,
      })
      .pipe(
        map((res) => {
          const start = (page - 1) * pageSize;
          const end = start + pageSize;
          return {
            total: res.length,
            totalPage: Math.ceil(res.length / pageSize),
            pageSize: pageSize,
            page: page,
            items: res.slice(start, end),
          };
        }),
      );
  }

  findById(endpoint: string, id: string): Observable<T> {
    return this.http.get<T>(`${endpoint}/${id}`);
  }

  create(
    endpoint: string,
    dto: T | FormData,
    options?: HttpPostOptions,
  ): Observable<T> {
    return this.http.post<T>(endpoint, dto, options);
  }

  update(
    endpoint: string,
    _id: string,
    dto: (T & { _id: string }) | FormData,
  ): Observable<T> {
    return this.http.patch<T>(`${endpoint}/${_id}`, dto);
  }

  delete(endpoint: string, id: string): Observable<T> {
    return this.http.delete<T>(`${endpoint}/${id}`);
  }
}
