import { Component, OnInit, signal } from '@angular/core';
import { Job } from '~/types/job';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { JobCardComponent } from '~/app/components/job/job-card/job-card.component';
import { SharedModule } from '~/app/shared/shared.module';
import { JobService } from '~/app/core/services/job.service';

@Component({
  selector: 'app-jobs',
  imports: [CommonModule, SharedModule, MatRippleModule, JobCardComponent],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
  standalone: true,
})
export class JobsComponent implements OnInit {
  jobsData = signal<Job[]>([]);
  selectJob: Job | undefined;
  constructor(private jobSrv: JobService) {}

  ngOnInit(): void {
    this.jobSrv.find({ page: 1, pageSize: 100 }).subscribe((res) => {
      this.jobsData.set(res.items);
    });
  }

  onSelectJob(index: number): void {
    this.selectJob = this.jobsData()[index];
  }
}
