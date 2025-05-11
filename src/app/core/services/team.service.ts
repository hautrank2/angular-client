import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { Team } from '~/types/teams';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TeamService extends CrudService<Team> {
  constructor(http: HttpClient) {
    super(http, '/recruit/team');
  }
}
