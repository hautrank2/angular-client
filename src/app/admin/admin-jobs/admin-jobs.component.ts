import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Job } from '~/types/job';
import { API_REPONSE_BASE, ApiResponse } from '~/types/query';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CoreModule } from '~/app/core/core.module';
import { JobCardComponent } from '~/app/components/job/job-card/job-card.component';
import { JobFormComponent } from '~/app/components/job/job-form/job-form.component';

@Component({
  selector: 'app-admin-jobs',
  imports: [
    MatTableModule,
    CoreModule,
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
  jobData = signal<ApiResponse<Job>>(API_REPONSE_BASE);
  dataSource: Job[] = [];

  constructor(private http: HttpClient) {
    effect(() => {
      this.dataSource = this.jobData().items;
    });
  }

  ngOnInit(): void {
    this.http.get<Job[]>(`/data/jobs.json`).subscribe((res) => {
      const pageSize = 10;
      const page = 1;
      this.jobData.set({
        totalCount: res.length,
        totalPage: Math.ceil(res.length / pageSize),
        pageSize,
        page,
        items: res,
      });
    });
  }

  changeLayout(event: MatButtonToggleChange) {
    this.layout = event.value;
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
      .subscribe((result) => {});
  }
}
