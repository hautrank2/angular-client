import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { Validators } from '@angular/forms';
import { SKILL_DATA } from '~/app/constant/job';
import { CrudService } from '~/app/core/services/crud.service';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { PopCornerMovieModel } from '~/app/types/pop-corner';
import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MoviesService extends CrudService<PopCornerMovieModel> {
  constructor(http: HttpClient) {
    super(http, '/movie', environment.popCornerApiUrl);
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
        type: 'autocomplete',
        isArray: true,
        arrayVariant: 'chips',
        arrayConfig: { cols: 1 },
        options: [
          { label: 'Action', value: 'action' },
          { label: 'Drama', value: 'drama' },
          { label: 'Comedy', value: 'comedy' },
          { label: 'Sci-Fi', value: 'sci-fi' },
          { label: 'Romance', value: 'romance' },
        ],
        validators: [Validators.required],
      },
      {
        name: 'movieActors',
        label: 'Actors',
        type: 'text',
        isArray: true,
        arrayConfig: { cols: 1 },
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
      // Hidden fields
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        hidden: true,
      },
      {
        name: 'createdAt',
        label: 'Created At',
        type: 'date',
        hidden: true,
      },
      {
        name: 'updatedAt',
        label: 'Updated At',
        type: 'date',
        hidden: true,
      },
    ];
  }

  get tbColumns(): ShColumn<PopCornerMovieModel>[] {
    return [];
  }
}
