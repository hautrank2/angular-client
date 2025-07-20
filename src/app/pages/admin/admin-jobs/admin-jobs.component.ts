import { Component, OnInit } from '@angular/core';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { JobService } from '~/app/core/services/job.service';

@Component({
  selector: 'app-admin-jobs',
  imports: [SharedModule, UiModule],
  templateUrl: './admin-jobs.component.html',
  styleUrl: './admin-jobs.component.scss',
})
export class AdminJobsComponent {
  constructor(public jobSrv: JobService) {}
  readonly tbColumns: ShColumn[] = [
    {
      key: 'title',
      label: 'Job Title',
      type: 'text',
    },
    {
      key: 'location',
      label: 'Location',
      type: 'text',
    },
    {
      key: 'type',
      label: 'Job Type',
      type: 'text',
    },
    {
      key: 'createdAt',
      label: 'Posted Date',
      type: 'date',
    },
  ];
}
