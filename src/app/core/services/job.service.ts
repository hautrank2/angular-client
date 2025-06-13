import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Job } from '~/app/types/job';

@Injectable({
  providedIn: 'root',
})
export class JobService extends CrudService<Job> {
  constructor(http: HttpClient) {
    super(http, '/recruit/job');
  }
}
