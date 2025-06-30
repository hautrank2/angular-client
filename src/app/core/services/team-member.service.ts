import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { TeamMember } from '~/app/types/teams';
import { Injectable } from '@angular/core';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { Validators } from '@angular/forms';

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
      key: 'description',
      label: 'Description',
      type: 'text',
      validators: [Validators.required],
    },
  ];

  constructor(http: HttpClient) {
    super(http, '/recruit/team-member');
  }

  get formFields() {
    return this._fields;
  }
}
