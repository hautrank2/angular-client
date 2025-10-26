import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ShFormField,
  ShFormOptionSync,
} from '~/app/shared/components/form/form.types';
import { Validators } from '@angular/forms';
import { CrudService } from '~/app/core/services/crud.service';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { PopCornerMovieModel } from '~/app/types/pop-corner';
import { environment } from '~/environments/environment';
import { GenreService } from './genre.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesService extends CrudService<PopCornerMovieModel> {
  constructor(
    http: HttpClient,
    private genreSrv: GenreService,
  ) {
    super(http, '/movie', `${environment.popCornerUrl}/api`);
  }

  get formFields(): ShFormField[] {
    return [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        validators: [Validators.required, Validators.maxLength(200)],
      },
      {
        name: 'director',
        label: 'Director',
        type: 'text',
        validators: [Validators.required, Validators.maxLength(100)],
      },
      {
        name: 'country',
        label: 'Country',
        type: 'text',
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
        name: 'posterUrl',
        label: 'Poster URL',
        type: 'text',
        validators: [Validators.required],
      },
      {
        name: 'trailerUrl',
        label: 'Trailer URL',
        type: 'text',
        validators: [Validators.required],
      },
      {
        name: 'imgUrls',
        label: 'Image URLs',
        type: 'text',
        isArray: true,
        arrayVariant: 'chips',
        arrayConfig: { cols: 1 },
        validators: [Validators.required],
      },
      {
        name: 'movieGenres',
        label: 'Genres',
        type: 'select',
        multiple: true,
        options: this.genreSrv
          .getAll()
          .pipe(
            map((res) =>
              res.map((item) => ({ label: item.name, value: item.name })),
            ),
          ),
        validators: [Validators.required],
      },
      {
        name: 'movieActors',
        label: 'Actors',
        type: 'text',
        isArray: true,
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
