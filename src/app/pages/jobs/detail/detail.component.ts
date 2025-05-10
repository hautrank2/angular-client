import { Component, Input } from '@angular/core';
import { Job } from '~/types/job';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from '~/app/shared/shared.module';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, MatCardModule, MatChipsModule, SharedModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  @Input() data: Job | undefined;

  constructor() {}
}
