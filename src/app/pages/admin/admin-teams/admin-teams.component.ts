import { Component } from '@angular/core';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
import { TeamService } from '~/app/core/services/team.service';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { ShEntityFilter } from '~/app/shared/components/entity-manager/entity-manager.types';

@Component({
  selector: 'app-admin-teams',
  imports: [SharedModule, UiModule],
  providers: [TeamService],
  templateUrl: './admin-teams.component.html',
  styleUrl: './admin-teams.component.scss',
})
export class AdminTeamsComponent {
  constructor(public teamSrv: TeamService) {}

  findTeams = (filters: ShEntityFilter) => {
    return this.teamSrv.find({ ...filters, isMembers: true });
  };

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
