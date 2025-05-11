import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { TeamMember } from '~/types/teams';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TeamMemberService extends CrudService<TeamMember> {
  constructor(http: HttpClient) {
    super(http, '/recruit/team-member');
  }
}
