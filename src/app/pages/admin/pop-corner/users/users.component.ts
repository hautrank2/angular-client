import { Component } from '@angular/core';
import { UserService } from '~/app/core/services/pop-corner/user.service';
import { SharedModule } from '~/app/shared/shared.module';

@Component({
  selector: 'app-users',
  imports: [SharedModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  constructor(public userSrv: UserService) {}
}
