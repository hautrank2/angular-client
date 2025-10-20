import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { TeamMember } from '~/app/types/teams';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { SOCIALS } from '~/app/constant/social';
import { FormService } from '~/app/shared/services/form.service';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { ROLES } from '~/app/constant/role';

@Injectable({
  providedIn: 'root',
})
export class TeamMemberService extends CrudService<TeamMember> {
  constructor(
    http: HttpClient,
    private formSrv: FormService,
  ) {
    super(http, '/recruit/team-member');
  }

  createMember(values: any) {
    return this.create(this.formSrv.buildFormData(values));
  }

  get formFields(): ShFormField[] {
    return [
      {
        name: 'image',
        label: 'Avatar',
        type: 'upload',
        accept: ['image/*'],
        multiple: false,
        validators: [Validators.required, this.formSrv.fileValidator],
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        validators: [Validators.required],
      },
      {
        name: 'nickname',
        label: 'Nickname',
        type: 'text',
        validators: [Validators.required],
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        validators: [Validators.required, Validators.email],
      },
      {
        name: 'birthday',
        label: 'Birthday',
        type: 'date',
        validators: [Validators.required],
      },
      {
        name: 'roles',
        label: 'Roles',
        type: 'select',
        isArray: true,
        arrayConfig: {
          cols: 2,
        },
        options: ROLES.map((e) => ({ label: e, value: e })),
      },
      {
        name: 'hobbies',
        label: 'Hobbies',
        type: 'text',
        isArray: true,
        arrayConfig: {
          cols: 2,
        },
      },
      {
        name: 'socials',
        label: 'Socials',
        type: 'groupArray',
        arrayFields: [
          {
            name: 'platform',
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
            name: 'url',
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
          rowHeight: 158,
        },
        formOptions: {
          isGrid: true,
          appearance: 'outline',
        },
      },
    ];
  }

  get updateFormFields(): ShFormField[] {
    return this.formFields.filter((e) => e.name !== 'image');
  }
}
