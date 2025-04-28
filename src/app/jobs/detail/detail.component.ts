import { Component, Input } from '@angular/core';
import { Job } from '~/types/job';

@Component({
  selector: 'app-detail',
  imports: [],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  @Input() data: Job | undefined;

  constructor() {}
}
