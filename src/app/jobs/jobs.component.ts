import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { Job } from '~/types/job';
import { CommonModule } from '@angular/common';
import { TypographyDirective } from '~/directives/typography.directive';
import { MatRippleModule } from '@angular/material/core';
import { JobCardComponent } from '~/components/job/job-card/job-card.component';

@Component({
  selector: 'app-jobs',
  imports: [
    CommonModule,
    TypographyDirective,
    MatRippleModule,
    JobCardComponent,
  ],
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
    });
  }

  onSelectJob(index: number): void {
    this.selectJob = this.jobsData()[index];
  }
}
