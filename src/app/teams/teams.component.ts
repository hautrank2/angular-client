import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { Team } from '~/types/teams';
import { CoreModule } from '../core/core.module';
import { MatCardModule } from '@angular/material/card';
import { SOCIALS } from '~/constant/social';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-teams',
  imports: [CoreModule, MatCardModule, MatExpansionModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
})
export class TeamsComponent {
  readonly socialData = SOCIALS;
  teamData = signal<Team[]>([]);
  constructor(private http: HttpClient) {
    this.http.get<Team[]>('/data/teams.json').subscribe((res) => {
      this.teamData.set(res);
    });
  }

  public getSocialData(social: string) {
    return this.socialData.find((item) => item.id === social);
  }
}
