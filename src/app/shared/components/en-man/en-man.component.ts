import { Component, signal } from '@angular/core';
import { PaginationResponse } from '~/app/core/services/crud.service';
import { API_REPONSE_BASE } from '~/types/query';

@Component({
  selector: 'app-en-man',
  standalone: false,
  templateUrl: './en-man.component.html',
  styleUrl: './en-man.component.scss',
})
export class EnManComponent<T> {
  data = signal<PaginationResponse<T>>(API_REPONSE_BASE);

  constructor() {}
}
