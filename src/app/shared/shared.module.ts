import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyDirective } from './directives/typography.directive';
import { FormWrapperComponent } from './components/form-wrapper/form-wrapper.component';
import { UiModule } from './ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormService } from './services/form.service';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { JsonFormComponent } from './components/json-form/json-form.component';
import { AttrDirective } from './directives/attr.directive';

const services = [FormService];
const components = [
  FormWrapperComponent,
  FileUploadComponent,
  JsonFormComponent,
];
const directives = [TypographyDirective, AttrDirective];

@NgModule({
  declarations: [...components, ...directives],
  imports: [ReactiveFormsModule, CommonModule, UiModule],
  exports: [CommonModule, ...components, ...directives],
  providers: [...services],
})
export class SharedModule {}
