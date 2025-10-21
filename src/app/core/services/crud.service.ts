import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~/environments/environment';

export type PaginationResponse<T> = {
  total: number;
  totalPage: number;
  pageSize: number;
  page: number;
  items: T[];
};

export interface HttpPostOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  observe?: 'body';
  responseType?: 'json';
  withCredentials?: boolean;
  context?: HttpContext;
}

export const API_REPONSE_BASE: PaginationResponse<any> = {
  total: 0,
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
    @Inject('API_ENDPOINT') protected apiTag: string,
    @Inject('API_DOMAIN') protected apiDomain?: string,
  ) {
    this.apiEndpoint = (apiDomain ?? environment.apiUrl) + apiTag;
  }

  find(params: ApiPaginationQuery): Observable<PaginationResponse<T>> {
    return this.http.get<PaginationResponse<T>>(this.apiEndpoint, {
      params,
    });
  }

  findById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiEndpoint}/${id}`);
  }

  create(dto: T | FormData, options?: HttpPostOptions): Observable<T> {
    return this.http.post<T>(this.apiEndpoint, dto, options);
  }

  update(_id: string, dto: T | FormData): Observable<T> {
    return this.http.patch<T>(`${this.apiEndpoint}/${_id}`, dto);
  }

  delete(id: string): Observable<T> {
    return this.http.delete<T>(`${this.apiEndpoint}/${id}`);
  }
}
