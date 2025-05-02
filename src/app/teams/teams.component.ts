import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { Team } from '~/types/teams';
import { CoreModule } from '../core/core.module';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-teams',
  imports: [CoreModule, MatCardModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
})
export class TeamsComponent {
  teamData = signal<Team[]>([]);
  constructor(private http: HttpClient) {
    this.http.get<Team[]>('/data/teams.json').subscribe((res) => {
      this.teamData.set(res);
    });
  }
}
