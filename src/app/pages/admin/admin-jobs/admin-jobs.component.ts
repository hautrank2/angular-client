import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Job } from '~/types/job';
import { API_REPONSE_BASE, ApiPaginationResponse } from '~/types/query';
import { MatTableModule } from '@angular/material/table';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '~/app/shared/shared.module';
import { JobCardComponent } from '~/app/components/job/job-card/job-card.component';
import { JobFormComponent } from '~/app/components/job/job-form/job-form.component';
import { JobService } from '~/app/core/services/job.service';
import { TablePagination } from '~/types/table';

@Component({
  selector: 'app-admin-jobs',
  imports: [
    MatTableModule,
    SharedModule,
    JobCardComponent,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatButtonModule,
  ],
  templateUrl: './admin-jobs.component.html',
  styleUrl: './admin-jobs.component.scss',
})
export class AdminJobsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  layout: 'grid' | 'table' = 'table';
  displayedColumns: string[] = [
    'title',
    'location',
    'type',
    'createdAt',
    'actions',
  ];
  jobData = signal<ApiPaginationResponse<Job>>(API_REPONSE_BASE);
  dataSource: Job[] = [];
  filter: TablePagination = { pageSize: 100, page: 1 };

  constructor(private jobSrv: JobService) {
    effect(() => {
      this.dataSource = this.jobData().items;
    });
  }

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData() {
    this.jobSrv.find(this.filter).subscribe((res) => {
      this.jobData.set(res);
    });
  }

  changeLayout(event: MatButtonToggleChange) {
    this.layout = event.value;
  }

  deleteJob(item: Job) {
    this.jobSrv.delete(item._id).subscribe(() => {
      this.fetchData();
    });
  }

  openJobFormDialog(defaultValues?: Job) {
    this.dialog
      .open(JobFormComponent, {
        maxWidth: '60vw',
        width: '60vw',
        data: {
          title: defaultValues ? 'Edit Job' : 'Create Job',
          defaultValues,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.success) {
          this.fetchData();
        }
      });
  }
}
