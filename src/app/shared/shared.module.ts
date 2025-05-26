import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyDirective } from './directives/typography.directive';
import { FormWrapperComponent } from './components/form/form.component';
import { UiModule } from './ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { JsonFormComponent } from './components/json-form/json-form.component';
import { AttrDirective } from './directives/attr.directive';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { InputPasswordComponent } from './components/form/input-password/input-password.component';
import { FormService } from './services/form.service';

const services = [FormService];
const components = [
  FormWrapperComponent,
  FileUploadComponent,
  JsonFormComponent,
  AutocompleteComponent,
];
const directives = [TypographyDirective, AttrDirective];

@NgModule({
  declarations: [...components, ...directives, InputPasswordComponent],
  imports: [ReactiveFormsModule, CommonModule, UiModule],
  exports: [CommonModule, ...components, ...directives],
  providers: [...services],
})
export class SharedModule {}
