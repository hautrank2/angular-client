import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Job } from '~/app/types/job';
import { ShFormField } from '~/app/shared/components/form/form.types';
import { Validators } from '@angular/forms';
import { SKILL_DATA } from '~/app/constant/job';

@Injectable({
  providedIn: 'root',
})
export class JobService extends CrudService<Job> {
  constructor(http: HttpClient) {
    super(http, '/recruit/job');
  }

  get formFields(): ShFormField[] {
    return [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        validators: [Validators.required],
      },
      {
        key: 'location',
        label: 'Location',
        type: 'text',
        validators: [Validators.required],
      },
      {
        key: 'type',
        label: 'Job',
        type: 'select',
        validators: [Validators.required],
        options: ['Full-time', 'Part-time', 'Internship', 'Contract'].map(
          (e) => ({ label: e, value: e }),
        ),
      },
      {
        key: 'description',
        label: 'Description',
        type: 'area',
        validators: [Validators.required],
      },
      {
        key: 'skills',
        label: 'Skills',
        type: 'autocomplete',
        validators: [Validators.required],
        options: SKILL_DATA.map((e) => ({ label: e.title, value: e.key })),
      },
      {
        key: 'requirement',
        label: 'Requirements',
        type: 'text',
        isArray: true,
        validators: [Validators.required],
        arrayConfig: {
          cols: 1,
        },
      },
      {
        key: 'responsibility',
        label: 'Responsibility',
        type: 'text',
        isArray: true,
        validators: [Validators.required],
        arrayConfig: {
          cols: 1,
        },
      },
      {
        key: 'benefit',
        label: 'Benefit',
        type: 'text',
        isArray: true,
        validators: [Validators.required],
        arrayConfig: {
          cols: 1,
        },
      },
    ];
  }
}
