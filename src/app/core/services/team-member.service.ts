import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { TeamMember } from '~/app/types/teams';
import { Injectable } from '@angular/core';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { Validators } from '@angular/forms';
import { SOCIALS } from '~/app/constant/social';

@Injectable({
  providedIn: 'root',
})
export class TeamMemberService extends CrudService<TeamMember> {
  private readonly _fields: ShFormField[] = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      validators: [Validators.required],
    },
    {
      key: 'nickname',
      label: 'Nickname',
      type: 'text',
      validators: [Validators.required],
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      validators: [Validators.required, Validators.email],
    },
    {
      key: 'roles',
      label: 'Roles',
      type: 'text',
      isArray: true,
      validators: [],
    },
    {
      key: 'socials',
      label: 'Socials',
      type: 'groupArray',
      arrayFields: [
        {
          key: 'platform',
          label: 'Platform',
          type: 'select',
          options: SOCIALS.map((e) => ({
            label: e._id.toUpperCase(),
            value: e._id,
          })),
          validators: [Validators.required],
          col: 4,
        },
        {
          key: 'url',
          label: 'Url',
          type: 'text',
          validators: [Validators.required],
          col: 8,
        },
      ],
      validators: [],
      config: {
        cols: 1,
        col: 1,
        row: 1,
        gutter: 8,
        rowHeight: 244,
      },
      formOptions: {
        isGrid: true,
        appearance: 'outline',
      },
    },
  ];

  constructor(http: HttpClient) {
    super(http, '/recruit/team-member');
  }

  get formFields() {
    return this._fields;
  }
}
