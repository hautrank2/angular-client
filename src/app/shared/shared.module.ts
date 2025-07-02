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
import { ImgDirective } from './directives/img.directive';
import { TableComponent } from './components/table/table.component';
import { TableDirective } from './components/table/table.directive';
import { TableCellComponent } from './components/table/table-cell/table-cell.component';
import { EmptyComponent } from './components/empty/empty.component';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { FormatNumberPipe } from './pipes/format-number.pipe';
import { ScrollDirective } from './directives/scroll.directive';
import { TableWrapperComponent } from './components/table-wrapper/table-wrapper.component';
import { EntityFormComponent } from './components/entity-form/entity-form.component';
import { EntityManagerComponent } from './components/entity-manager/entity-manager.component';
import { FormFieldComponent } from './components/form-field/form-field.component';

const services = [FormService];
const components = [
  FormWrapperComponent,
  FileUploadComponent,
  JsonFormComponent,
  AutocompleteComponent,
  TableComponent,
  TableCellComponent,
  EmptyComponent,
  EntityManagerComponent,
  EntityFormComponent,
  InputPasswordComponent,
  TableWrapperComponent,
];
const directives = [
  TypographyDirective,
  AttrDirective,
  ImgDirective,
  TableDirective,
  ScrollDirective,
];
const pipes = [FormatTimePipe, FormatNumberPipe];

@NgModule({
  declarations: [...components, ...directives, FormFieldComponent],
  imports: [ReactiveFormsModule, CommonModule, UiModule, ...pipes],
  exports: [CommonModule, ...components, ...directives, ...pipes],
  providers: [...services],
})
export class SharedModule {}
