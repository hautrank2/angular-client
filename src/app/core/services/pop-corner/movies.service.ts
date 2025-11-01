import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { Validators } from '@angular/forms';
import {
  ApiPaginationQuery,
  CrudService,
  PaginationResponse,
} from '~/app/core/services/crud.service';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { PopCornerMovieModel } from '~/app/types/pop-corner';
import { environment } from '~/environments/environment';
import { GenreService } from './genre.service';
import { map, Observable } from 'rxjs';
import { ArtistService } from './artist.service';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesService extends CrudService<PopCornerMovieModel> {
  constructor(
    http: HttpClient,
    private genreSrv: GenreService,
    private artistSrv: ArtistService,
    private commonSrv: CommonService,
  ) {
    super(http, '/movie', `${environment.popCornerUrl}/api`);
  }

  override find(
    params: ApiPaginationQuery,
  ): Observable<PaginationResponse<PopCornerMovieModel>> {
    return this.http
      .get<
        PaginationResponse<PopCornerMovieModel>
      >(`${environment.popCornerUrl}/api/movie`, { params })
      .pipe(
        map((res) => {
          return {
            ...res,
            items: res.items.map((e) => ({
              ...e,
              actorIds: e.actors.map((m) => m.id),
              genreIds: e.genres.map((m) => m.id),
            })),
          };
        }),
      );
  }

  get formFields(): ShFormField[] {
    return [
      {
        name: 'imgFiles',
        label: 'Images',
        type: 'upload',
        multiple: true,
        validators: [Validators.required],
      },
      {
        name: 'poster',
        label: 'Poster',
        type: 'upload',
        multiple: false,
        validators: [Validators.required],
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        validators: [Validators.required, Validators.maxLength(200)],
      },
      {
        name: 'country',
        label: 'Country',
        type: 'select',
        options: this.commonSrv.getContriesOption(),
        validators: [Validators.required, Validators.maxLength(100)],
      },
      {
        name: 'releaseDate',
        label: 'Release Date',
        type: 'date',
        validators: [Validators.required],
      },
      {
        name: 'duration',
        label: 'Duration (minutes)',
        type: 'number',
        validators: [Validators.required, Validators.min(0)],
        inputs: { min: 0 },
      },
      {
        name: 'description',
        label: 'Description',
        type: 'area',
        validators: [Validators.required, Validators.maxLength(2000)],
      },
      {
        name: 'trailerUrl',
        label: 'Trailer URL',
        type: 'text',
        validators: [Validators.required],
      },
      {
        name: 'genreIds',
        label: 'Genres',
        type: 'select',
        multiple: true,
        options: this.genreSrv
          .getAll()
          .pipe(
            map((res) =>
              res.map((item) => ({ label: item.name, value: item.id })),
            ),
          ),
        validators: [Validators.required],
      },
      {
        name: 'directorId',
        label: 'Director',
        type: 'select',
        options: this.artistSrv.findAll().pipe(
          map((res) =>
            res.items.map((e) => ({
              label: e.name,
              value: e.id,
            })),
          ),
        ),
        validators: [Validators.required],
      },
      {
        name: 'actorIds',
        label: 'Actors',
        type: 'select',
        multiple: true,
        options: this.artistSrv.findAll().pipe(
          map((res) =>
            res.items.map((e) => ({
              label: e.name,
              value: e.id,
            })),
          ),
        ),
        validators: [Validators.required],
      },
      {
        name: 'credits',
        label: 'Credits (name - role)',
        type: 'text',
        isArray: true,
        arrayConfig: { cols: 1 },
        placeholder: 'e.g. Hans Zimmer - Composer',
      },
      {
        name: 'view',
        label: 'Views',
        type: 'number',
        defaultValue: 0,
        inputs: { min: 0 },
        validators: [Validators.min(0)],
      },
      {
        name: 'avgRating',
        label: 'Avg Rating (0–10)',
        type: 'number',
        defaultValue: 0,
        inputs: { min: 0, max: 10, step: 0.1 },
        validators: [Validators.min(0), Validators.max(10)],
      },
    ];
  }

  get tbColumns(): ShColumn<PopCornerMovieModel>[] {
    return [
      {
        name: 'posterUrl',
        label: 'Poster',
        type: 'img',
        render(value) {
          return `${environment.popCornerUrl}${value}`;
        },
      },
      {
        name: 'imgUrls',
        label: 'ImgUrls',
        type: 'imgs',
        render(value: string[]) {
          return value.map((v) => `${environment.popCornerUrl}${v}`);
        },
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
      },
      {
        name: 'releaseDate',
        label: 'ReleaseDate',
        type: 'date',
      },
      {
        name: 'director',
        label: 'Director',
        type: 'text',
        render(value) {
          return value.name;
        },
      },
      {
        name: 'country',
        label: 'Country',
        type: 'text',
      },
      {
        name: 'duration',
        label: 'Duration',
        type: 'text',
        render(value, item, index) {
          const h = Math.round(value / 60);
          const m = value % 60;
          return `${h}h ${m}m`;
        },
      },
    ];
  }
}
