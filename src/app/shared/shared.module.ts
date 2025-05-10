import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyDirective } from './directives/typography.directive';

@NgModule({
  declarations: [],
  imports: [CommonModule, TypographyDirective],
  exports: [CommonModule, TypographyDirective],
})
export class SharedModule {}
