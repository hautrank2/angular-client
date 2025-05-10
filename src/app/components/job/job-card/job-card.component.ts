import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Job } from '~/types/job';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from '~/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-job-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
})
export class JobCardComponent {
  @Input() data: Job | undefined;
  @Input() disableEdit?: boolean = false;
  @Output() clickEdit = new EventEmitter();
  @Output() clickDelete = new EventEmitter();

  isHovered: boolean = false;
  constructor() {}

  edit() {
    this.clickEdit.emit();
  }

  remove() {
    this.clickDelete.emit();
  }
}
