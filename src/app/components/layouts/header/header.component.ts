import { Component } from '@angular/core';
import { TypographyDirective } from '~/directives/typography.directive';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-header',
  imports: [TypographyDirective, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
