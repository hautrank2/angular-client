import { Component, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '~/app/shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [
    MatTableModule,
    SharedModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatButtonModule,
    RouterOutlet,
  ],
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

  constructor(private location: Location) {
    this.activeRoute.set(this.location.path());
  }
}
