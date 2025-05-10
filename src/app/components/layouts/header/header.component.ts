import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '~/app/shared/shared.module';
@Component({
  selector: 'app-header',
  imports: [MatButtonModule, SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
