import { Component, signal } from '@angular/core';
import { SharedModule } from '~/app/shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { UiModule } from '~/app/shared/ui/ui.module';

@Component({
  selector: 'app-admin',
  imports: [SharedModule, UiModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  activeRoute = signal('/admin');
  sidebarOpened = signal(true);
  readonly sidebarRoutes = [
    { title: 'Jobs', path: '/admin', icon: 'cases' },
    { title: 'Teams', path: '/admin/teams', icon: 'group' },
    { title: 'Members', path: '/admin/members', icon: 'person' },
  ];

  readonly routes = [
    {
      title: 'Recruiment',
      path: '/admin/recruiment',
      children: [
        {
          title: 'Jobs',
          path: '/admin/recruiment',
          icon: 'cases',
        },
        {
          title: 'Teams',
          path: '/admin/recruiment/teams',
          icon: 'group',
        },
        {
          title: 'Members',
          path: '/admin/recruiment/members',
          icon: 'person',
        },
      ],
    },
    {
      title: 'PopCorner',
      path: '/admin/pop-corner',
      children: [
        {
          title: 'Movies',
          path: '/admin/pop-corner/movies',
          icon: 'movie',
        },
        {
          title: 'Artist',
          path: '/admin/pop-corner/artists',
          icon: 'person',
        },
        {
          title: 'User',
          path: '/admin/pop-corner/users',
          icon: 'account_circle',
        },
      ],
    },
  ];

  constructor(private location: Location) {
    this.activeRoute.set(this.location.path());
  }
}
