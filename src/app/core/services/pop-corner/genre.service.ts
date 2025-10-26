import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PopCornerGenreModel } from '~/app/types/pop-corner';
import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  constructor(private httpClient: HttpClient) {}

  getAll() {
    return this.httpClient.get<PopCornerGenreModel[]>(
      `${environment.popCornerUrl}/api/genre`,
    );
  }
}
