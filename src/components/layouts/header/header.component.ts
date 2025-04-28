import { Component } from '@angular/core';
import { TypographyDirective } from '~/directives/typography.directive';

@Component({
  selector: 'app-header',
  imports: [TypographyDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
