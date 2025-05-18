import { Component, effect, inject, signal } from '@angular/core';
import { API_REPONSE_BASE, ApiPaginationResponse } from '~/types/query';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '~/app/shared/shared.module';
import { Team } from '~/types/teams';
import { TeamFormComponent } from '~/app/components/team/team-form/team-form.component';
import { UiModule } from '~/app/shared/ui/ui.module';
import { TeamService } from '~/app/core/services/team.service';
import { TablePagination } from '~/types/table';

@Component({
  selector: 'app-admin-teams',
  imports: [MatTableModule, SharedModule, UiModule],
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
  data = signal<ApiPaginationResponse<Team>>(API_REPONSE_BASE);
  dataSource: Team[] = [];
  filter: TablePagination = { pageSize: 100, page: 1 };

  constructor(private http: HttpClient, private teamSrv: TeamService) {
    effect(() => {
      this.dataSource = this.data().items;
    });
  }

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData() {
    this.teamSrv.find(this.filter).subscribe((res) => {
      this.data.set(res);
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
      .subscribe((result) => {
        if (result?.success) {
          this.fetchData();
        }
      });
  }

  remove(item: Team) {
    this.teamSrv.delete(item._id).subscribe(() => {
      this.fetchData();
    });
  }
}
