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
import { TeamMember } from '~/types/teams';
import { TeamMemberFormComponent } from '~/app/components/team/team-member-form/team-member-form.component';

@Component({
  selector: 'app-admin-members',
  imports: [
    MatTableModule,
    CoreModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatButtonModule,
  ],
  templateUrl: './admin-members.component.html',
  styleUrl: './admin-members.component.scss',
})
export class AdminMembersComponent {
  readonly dialog = inject(MatDialog);
  layout: 'grid' | 'table' = 'table';
  displayedColumns: string[] = [
    'avatar',
    'name',
    'nickname',
    'email',
    'roles',
    'actions',
  ];
  data = signal<ApiResponse<TeamMember>>(API_REPONSE_BASE);
  dataSource: TeamMember[] = [];

  constructor(private http: HttpClient) {
    effect(() => {
      this.dataSource = this.data().items;
    });
  }

  ngOnInit(): void {
    this.http.get<TeamMember[]>(`/data/members.json`).subscribe((res) => {
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

  openDialog(defaultValues?: TeamMember) {
    this.dialog
      .open(TeamMemberFormComponent, {
        maxWidth: '60vw',
        width: '60vw',
        autoFocus: true,
        restoreFocus: true,
        data: {
          title: defaultValues ? 'Edit Team member' : 'Create Team member',
          defaultValues,
        },
      })
      .afterClosed()
      .subscribe((result) => {});
  }
}
