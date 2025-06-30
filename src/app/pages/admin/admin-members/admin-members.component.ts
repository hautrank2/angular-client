import { Component } from '@angular/core';
import { SharedModule } from '~/app/shared/shared.module';
import { TeamMemberService } from '~/app/core/services/team-member.service';
import { UiModule } from '~/app/shared/ui/ui.module';
import { ShColumn } from '~/app/shared/components/table/table.types';

@Component({
  selector: 'app-admin-members',
  imports: [SharedModule, UiModule],
  templateUrl: './admin-members.component.html',
  styleUrl: './admin-members.component.scss',
})
export class AdminMembersComponent {
  constructor(public teamMemberSrv: TeamMemberService) {}

  readonly tbColumns: ShColumn[] = [
    {
      key: 'avatar',
      label: 'Avatar',
      type: 'img',
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
