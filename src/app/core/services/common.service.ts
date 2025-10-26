import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ShFormOption,
  ShFormOptionSync,
} from '~/app/shared/components/form/form.types';
import { environment } from '~/environments/environment';

export type RestCountryLite = {
  flags: {
    png: string;
    svg: string;
    alt?: string; // có thể vắng
  };
  name: {
    common: string;
    official: string;
    nativeName?: Record<
      string,
      {
        official: string;
        common: string;
      }
    >;
  };
};

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  getContries() {
    return this.http.get(`${environment.contryApi}`);
  }

  getContriesOption(): Observable<ShFormOption[]> {
    return this.http.get<RestCountryLite[]>(`${environment.contryApi}`).pipe(
      map((res) =>
        res
          .map((e) => ({
            label: e.name.common,
            value: e.name.common,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      ),
    );
  }
}
