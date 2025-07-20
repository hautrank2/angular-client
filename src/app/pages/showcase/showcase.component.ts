import { Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';

@Component({
  selector: 'app-showcase',
  imports: [SharedModule, UiModule, RouterOutlet],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
})
export class ShowcaseComponent {
  activeRoute = signal('/showcase');
  sidebarOpened = signal(true);
  readonly sidebarRoutes = [
    { title: 'Table', path: '/showcase/table', icon: 'table_view' },
    { title: 'Form', path: '/showcase/form', icon: 'dynamic_form' },
  ];

  constructor(private location: Location) {
    this.activeRoute.set(this.location.path());
  }
}
