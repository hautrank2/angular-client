import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
import { TeamService } from '~/app/core/services/team.service';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { FormService } from '~/app/shared/services/form.service';

@Component({
  selector: 'app-admin-teams',
  imports: [MatTableModule, SharedModule, UiModule],
  templateUrl: './admin-teams.component.html',
  styleUrl: './admin-teams.component.scss',
})
export class AdminTeamsComponent {
  constructor(
    public teamSrv: TeamService,
    public formSrv: FormService,
  ) {}

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
  ];
}
