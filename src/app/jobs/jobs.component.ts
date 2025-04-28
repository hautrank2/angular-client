import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { Job } from '~/types/job';
import { CommonModule } from '@angular/common';
import { TypographyDirective } from '../directives/typography.directive';
import { DetailComponent } from './detail/detail.component';

@Component({
  selector: 'app-jobs',
  imports: [CommonModule, TypographyDirective, DetailComponent],
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

  jsonStringify(data: Job) {
    return JSON.stringify(data);
  }
}
