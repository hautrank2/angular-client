import { HttpClient } from '@angular/common/http';
import { Component, effect, OnInit, signal } from '@angular/core';
import { Job } from '~/types/job';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { JobCardComponent } from '~/app/components/job/job-card/job-card.component';
import { CoreModule } from '../core/core.module';

@Component({
  selector: 'app-jobs',
  imports: [CommonModule, CoreModule, MatRippleModule, JobCardComponent],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
  standalone: true,
})
export class JobsComponent implements OnInit {
  jobsData = signal<Job[]>([]);
  selectJob: Job | undefined;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Job[]>(`/data/jobs.json`).subscribe((res) => {
      this.jobsData.set(res);
      if (this.selectJob === undefined) {
        this.selectJob = res[0];
      }
    });
  }

  onSelectJob(index: number): void {
    this.selectJob = this.jobsData()[index];
  }
}
