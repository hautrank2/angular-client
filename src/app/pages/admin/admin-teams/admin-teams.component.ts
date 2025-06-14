import { Component, effect, inject, signal } from '@angular/core';
import {
  API_REPONSE_BASE,
  ApiPaginationQuery,
  PaginationResponse,
} from '~/app/types/query';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '~/app/shared/shared.module';
import { Team } from '~/app/types/teams';
import { TeamFormComponent } from '~/app/components/team/team-form/team-form.component';
import { UiModule } from '~/app/shared/ui/ui.module';
import { TeamService } from '~/app/core/services/team.service';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { FormGroup } from '@angular/forms';
import { FormService } from '~/app/shared/services/form.service';
import { ShFormField } from '~/app/shared/components/form/form.types';

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
  data = signal<PaginationResponse<Team>>(API_REPONSE_BASE);
  dataSource: Team[] = [];
  filter: ApiPaginationQuery = { pageSize: 100, page: 1, isMembers: true };
  form = new FormGroup({});

  constructor(
    private teamSrv: TeamService,
    private formSrv: FormService,
  ) {
    this.form = this.formSrv.buildTableForm(this.tbColumns);
    this.form.valueChanges.subscribe((res) => {
      console.log('change form', res);
    });
    effect(() => {
      this.dataSource = this.data().items;
    });
  }

  get formFields(): ShFormField[] {
    return this.formSrv.convertTableColsToFormField(this.tbColumns);
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
          defaultValues: defaultValues && {
            ...defaultValues,
            members: defaultValues?.members?.map((e) => e._id) || [],
          },
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

  scrollBottom() {}

  readonly tbColumns: ShColumn[] = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      key: 'description',
      label: 'Description',
      type: 'text',
    },
    {
      key: 'members',
      label: 'Members',
      type: 'text',
      formatter: (value) => value.length,
    },
    {
      key: 'action',
      label: '',
      type: 'actions',
      actions: [
        {
          label: 'Edit',
          icon: 'edit',
          type: 'btn',
          onClick: (_, item) => {
            this.openTeamDialog(item);
          },
        },
        {
          label: 'Delete',
          icon: 'delete',
          type: 'btn',
          onClick: (_, item) => {
            this.remove(item);
          },
        },
      ],
    },
  ];
}
