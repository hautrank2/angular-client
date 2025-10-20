import { Component, OnInit } from '@angular/core';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { JobService } from '~/app/core/services/job.service';
import { Job } from '~/app/types/job';

@Component({
  selector: 'app-admin-jobs',
  imports: [SharedModule, UiModule],
  templateUrl: './admin-jobs.component.html',
  styleUrl: './admin-jobs.component.scss',
})
export class AdminJobsComponent {
  constructor(public jobSrv: JobService) {}
  readonly tbColumns: ShColumn<Job>[] = [
    {
      name: 'title',
      label: 'Job Title',
      type: 'text',
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
    },
    {
      name: 'type',
      label: 'Job Type',
      type: 'text',
    },
    {
      name: 'createdAt',
      label: 'Posted Date',
      type: 'date',
    },
  ];
}
