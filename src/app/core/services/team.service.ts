import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { Team } from '~/types/teams';
import { Injectable } from '@angular/core';
import { FormField } from '~/app/shared/components/form/form.types';
import { map, Observable } from 'rxjs';
import { TeamMemberService } from './team-member.service';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TeamService extends CrudService<Team> {
  private readonly _fields: FormField[] = [
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
    {
      key: 'members',
      label: 'Members',
      type: 'autocomplete',
      options: [],
    },
  ];
  constructor(http: HttpClient, private teamMemberSrv: TeamMemberService) {
    super(http, '/recruit/team');
  }

  getFormFields(): Observable<FormField[]> {
    return this.teamMemberSrv.find({ pageSize: 10, page: 1 }).pipe(
      map((res) => {
        const result = this._fields.slice();
        if (result[2].type === 'autocomplete') {
          result[2].options = res.items.map((e) => ({
            label: e.name,
            value: e._id,
          }));
        }
        return result;
      })
    );
  }
}
