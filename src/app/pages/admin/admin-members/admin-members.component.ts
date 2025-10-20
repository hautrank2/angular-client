import { Component } from '@angular/core';
import { SharedModule } from '~/app/shared/shared.module';
import { TeamMemberService } from '~/app/core/services/team-member.service';
import { UiModule } from '~/app/shared/ui/ui.module';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { FormService } from '~/app/shared/services/form.service';
import { Observable } from 'rxjs';
import { TeamMember } from '~/app/types/teams';

@Component({
  selector: 'app-admin-members',
  imports: [SharedModule, UiModule],
  templateUrl: './admin-members.component.html',
  styleUrl: './admin-members.component.scss',
})
export class AdminMembersComponent {
  constructor(
    public teamMemberSrv: TeamMemberService,
    private formSrv: FormService,
  ) {}

  readonly tbColumns: ShColumn<TeamMember>[] = [
    {
      name: 'avatar',
      label: 'Avatar',
      type: 'img',
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      name: 'nickname',
      label: 'Nickname',
      type: 'text',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
    },
    {
      name: 'roles',
      label: 'Roles',
      type: 'chips',
    },
  ];
}
