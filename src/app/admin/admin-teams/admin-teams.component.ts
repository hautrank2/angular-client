import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { API_REPONSE_BASE, ApiResponse } from '~/types/query';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CoreModule } from '~/app/core/core.module';
import { Team } from '~/types/teams';
import { TeamFormComponent } from '~/app/components/team/team-form/team-form.component';

@Component({
  selector: 'app-admin-teams',
  imports: [
    MatTableModule,
    CoreModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatButtonModule,
  ],
  templateUrl: './admin-teams.component.html',
  styleUrl: './admin-teams.component.scss',
})
export class AdminTeamsComponent {
  readonly dialog = inject(MatDialog);
  layout: 'grid' | 'table' = 'table';
  displayedColumns: string[] = [
    'name',
    'description',
    'membersCount',
    'createdAt',
    'actions',
  ];
  data = signal<ApiResponse<Team>>(API_REPONSE_BASE);
  dataSource: Team[] = [];

  constructor(private http: HttpClient) {
    effect(() => {
      this.dataSource = this.data().items;
    });
  }

  ngOnInit(): void {
    this.http.get<Team[]>(`/data/teams.json`).subscribe((res) => {
      const pageSize = 10;
      const page = 1;
      this.data.set({
        totalCount: res.length,
        totalPage: Math.ceil(res.length / pageSize),
        pageSize,
        page,
        items: res,
      });
    });
  }

  changeLayout(event: MatButtonToggleChange) {
    this.layout = event.value;
  }

  openTeamDialog(defaultValues?: Team) {
    this.dialog
      .open(TeamFormComponent, {
        maxWidth: '60vw',
        width: '60vw',
        autoFocus: true,
        restoreFocus: true,
        data: {
          title: defaultValues ? 'Edit Team' : 'Create Team',
          defaultValues,
        },
      })
      .afterClosed()
      .subscribe((result) => {});
  }
}
