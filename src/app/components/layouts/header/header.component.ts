import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CoreModule } from '~/app/core/core.module';
@Component({
  selector: 'app-header',
  imports: [MatButtonModule, CoreModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
