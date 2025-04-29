import { Component, effect, OnInit, signal } from '@angular/core';
import { Job } from '~/types/job';
import { API_REPONSE_BASE, ApiResponse } from '~/types/query';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { JobCardComponent } from '../../components/job/job-card/job-card.component';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin',
  imports: [
    MatTableModule,
    CommonModule,
    JobCardComponent,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  layout: 'grid' | 'table' = 'grid';
  displayedColumns: string[] = ['title', 'location', 'type', 'createdAt'];
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
}
