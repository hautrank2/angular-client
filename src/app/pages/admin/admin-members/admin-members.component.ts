import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { API_REPONSE_BASE, ApiPaginationResponse } from '~/types/query';
import { MatTableModule } from '@angular/material/table';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '~/app/shared/shared.module';
import { TeamMember } from '~/types/teams';
import { TeamMemberFormComponent } from '~/app/components/team/team-member-form/team-member-form.component';
import { TablePagination } from '~/types/table';
import { TeamMemberService } from '~/app/core/services/team-member.service';
import { environment } from '~/environments/environment';

@Component({
  selector: 'app-admin-members',
  imports: [
    MatTableModule,
    SharedModule,
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
  data = signal<ApiPaginationResponse<TeamMember>>(API_REPONSE_BASE);
  dataSource: TeamMember[] = [];
  filter: TablePagination = { pageSize: 100, page: 1 };

  constructor(private teamMemberSrv: TeamMemberService) {
    effect(() => {
      this.dataSource = this.data().items;
    });
  }

  ngOnInit(): void {
    this.fetchData();
  }

  getAvatarUrl(avatar: string) {
    return `${environment.assetPrefix}${avatar}`;
  }

  private fetchData() {
    this.teamMemberSrv.find(this.filter).subscribe((res) => {
      this.data.set(res);
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
      .subscribe((result) => {
        if (result?.success) {
          this.fetchData();
        }
      });
  }

  remove(item: TeamMember) {
    this.teamMemberSrv.delete(item._id).subscribe(() => {
      this.fetchData();
    });
  }
}
