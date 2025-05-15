import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyDirective } from './directives/typography.directive';
import { FormWrapperComponent } from './components/form-wrapper/form-wrapper.component';
import { UiModule } from './ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormService } from './services/form.service';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { JsonFormComponent } from './components/json-form/json-form.component';

const services = [FormService];

@NgModule({
  declarations: [FormWrapperComponent, FileUploadComponent, JsonFormComponent],
  imports: [ReactiveFormsModule, CommonModule, TypographyDirective, UiModule],
  exports: [CommonModule, TypographyDirective, FormWrapperComponent],
  providers: [...services],
})
export class SharedModule {}
