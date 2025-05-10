import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~/environments/environment';

export type ApiPaginationResponse<T> = {
  totalCount: number;
  totalPage: number;
  pageSize: number;
  page: number;
  items: T[];
};

export const API_REPONSE_BASE: ApiPaginationResponse<any> = {
  totalCount: 0,
  totalPage: 0,
  pageSize: 0,
  page: 0,
  items: [],
};

export type ApiPaginationQuery = {
  pageSize: number;
  page: number;
  [key: string]: any;
};

@Injectable({
  providedIn: 'root',
})
export class CrudService<T> {
  apiEndpoint: string = '';
  constructor(
    protected http: HttpClient,
    @Inject('API_ENDPOINT') protected apiTag: string
  ) {
    this.apiEndpoint = environment.apiUrl + apiTag;
  }

  find(query: ApiPaginationQuery): Observable<ApiPaginationResponse<T>> {
    return this.http.get<ApiPaginationResponse<T>>(this.apiEndpoint, {
      params: query,
    });
  }

  findById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiEndpoint}/${id}`);
  }

  create(dto: T): Observable<T> {
    return this.http.post<T>(this.apiEndpoint, dto);
  }

  update(_id: string, dto: T & { _id: string }): Observable<T> {
    return this.http.patch<T>(`${this.apiEndpoint}/${_id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiEndpoint}/${id}`);
  }
}
