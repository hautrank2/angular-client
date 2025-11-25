import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PopCornerUserModel } from '~/app/types/pop-corner';
import { environment } from '~/environments/environment';
import { CrudService } from '../crud.service';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { Validators } from '@angular/forms';
import { CommonService } from '../common.service';
import { ShFilterField } from '~/app/shared/components/filters/filters.types';

@Injectable({
  providedIn: 'root',
})
export class UserService extends CrudService<PopCornerUserModel> {
  constructor(
    http: HttpClient,
    private commonSrv: CommonService,
  ) {
    super(http, '/user', `${environment.popCornerUrl}/api`);
  }

  get tbColumns(): ShColumn<PopCornerUserModel>[] {
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
        name: 'email',
        type: 'text',
        label: 'Email',
      },
      {
        name: 'birthday',
        type: 'date',
        label: 'Birthday',
      },
      {
        name: 'role',
        type: 'text',
        label: 'Role',
      },
    ];
  }

  get formFields(): ShFormField[] {
    return [
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        validators: [Validators.required, Validators.email],
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
        name: 'password',
        label: 'Password',
        type: 'password',
        validators: [Validators.required],
      },
    ];
  }

  get editFormFields(): ShFormField[] {
    const fs = this.formFields.filter((e) => !['password'].includes(e.name));
    fs.push({
      name: 'password',
      label: 'New Password',
      type: 'password',
    });
    fs.unshift({
      name: 'avatar',
      label: 'New avatar',
      type: 'upload',
      multiple: false,
    });
    return fs;
  }

  get addFormField(): ShFormField[] {
    return [
      {
        name: 'avatar',
        label: 'Avatar',
        type: 'upload',
        multiple: false,
      },
      ...this.formFields,
    ];
  }

  get filterFields(): ShFilterField[] {
    return [
      {
        label: 'Name',
        name: 'name',
        type: 'input',
      },
    ];
  }
}
