import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { Team } from '~/app/types/teams';
import { Injectable } from '@angular/core';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { Observable, of } from 'rxjs';
import { TeamMemberService } from './team-member.service';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TeamService extends CrudService<Team> {
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
  constructor(
    http: HttpClient,
    private teamMemberSrv: TeamMemberService,
  ) {
    super(http, '/recruit/team');
  }

  getFormFields(): Observable<ShFormField[]> {
    return of(this._fields.slice());
  }
}
