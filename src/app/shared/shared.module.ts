import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyDirective } from './directives/typography.directive';
import { FormWrapperComponent } from './components/form-wrapper/form-wrapper.component';
import { UiModule } from './ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormWrapperComponent],
  imports: [ReactiveFormsModule, CommonModule, TypographyDirective, UiModule],
  exports: [CommonModule, TypographyDirective, FormWrapperComponent],
})
export class SharedModule {}
