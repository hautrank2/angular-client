import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PopCornerArtistModel,
  PopCornerPaginationResponse,
} from '~/app/types/pop-corner';
import { environment } from '~/environments/environment';
import { CrudService } from '../crud.service';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { Validators } from '@angular/forms';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtistService extends CrudService<PopCornerArtistModel> {
  constructor(
    http: HttpClient,
    private commonSrv: CommonService,
  ) {
    super(http, '/artist', `${environment.popCornerUrl}/api`);
  }

  updateEntity(
    _id: string,
    dto: FormData | PopCornerArtistModel,
    defaultValues: PopCornerArtistModel,
  ): Observable<PopCornerArtistModel> {
    if (dto instanceof FormData) {
      dto.append('avatarUrl', defaultValues.avatarUrl);
    }
    return this.http.put<PopCornerArtistModel>(
      `${environment.popCornerUrl}/api/artist/${_id}`,
      dto,
    );
  }

  findAll(): Observable<PopCornerPaginationResponse<PopCornerArtistModel>> {
    return this.http.get<PopCornerPaginationResponse<PopCornerArtistModel>>(
      `${environment.popCornerUrl}/api/artist`,
    );
  }

  get tbColumns(): ShColumn<PopCornerArtistModel>[] {
    return [
      {
        name: 'avatarUrl',
        type: 'img',
        label: 'Avatar',
        render(value) {
          return `${environment.popCornerAssetUrl}${value}`;
        },
      },
      {
        name: 'name',
        type: 'text',
        label: 'Name',
      },
      {
        name: 'birthday',
        type: 'date',
        label: 'Birthday',
      },
      {
        name: 'country',
        type: 'text',
        label: 'Country',
      },
      {
        name: 'bio',
        type: 'text',
        label: 'Bio',
      },
    ];
  }

  get formFields(): ShFormField[] {
    return [
      {
        name: 'avatar',
        label: 'Avatar',
        type: 'upload',
        multiple: false,
        validators: [Validators.required],
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        validators: [Validators.required, Validators.maxLength(200)],
      },
      {
        name: 'birthday',
        label: 'Birthday',
        type: 'date',
        validators: [Validators.required],
      },
      {
        name: 'country',
        label: 'Country',
        type: 'select',
        options: this.commonSrv.getContriesOption(),
        validators: [Validators.required],
      },
      {
        name: 'bio',
        label: 'Bio',
        type: 'area',
        validators: [Validators.required],
      },
    ];
  }

  get editFormFields(): ShFormField[] {
    return this.formFields.map((e) => {
      if (e.name === 'avatar') {
        e.label === 'Avatar (Leave blank if you do not want to change)';
        e.validators = [];
      }
      return e;
    });
  }
}
