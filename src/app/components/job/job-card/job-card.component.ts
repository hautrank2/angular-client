import { Component, Input } from '@angular/core';
import { Job } from '~/types/job';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { TypographyDirective } from '~/directives/typography.directive';

@Component({
  selector: 'app-job-card',
  imports: [CommonModule, MatCardModule, MatChipsModule, TypographyDirective],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
})
export class JobCardComponent {
  @Input() data: Job | undefined;

  constructor() {}
}
