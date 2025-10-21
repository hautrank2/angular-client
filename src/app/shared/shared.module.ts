import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { EntityFormComponent } from './components/entity-form/entity-form.component';
import { EntityManagerComponent } from './components/entity-manager/entity-manager.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { UploadComponent } from './components/upload/upload.component';
import { UploadService } from './services/upload.service';
import { ImageComponent } from './components/image/image.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ZDirective } from './directives/z.directive';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { DateTimeComponent } from './components/date-time/date-time.component';
import { SelectSearchComponent } from './components/select-search/select-search.component';
import { FiltersComponent } from './components/filters/filters.component';
import { RouterLink } from '@angular/router';

const services = [FormService, UploadService];
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
  FormFieldComponent,
  UploadComponent,
  ImageComponent,
  DateTimeComponent,
  SelectSearchComponent,
  FiltersComponent,
];
const directives = [
  TypographyDirective,
  AttrDirective,
  ImgDirective,
  TableDirective,
  ScrollDirective,
  ZDirective,
];
const pipes = [FormatTimePipe, FormatNumberPipe];

@NgModule({
  declarations: [...components, ...directives],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    OverlayModule,
    UiModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    CdkTrapFocus,
    RouterLink,
    ...pipes,
  ],
  exports: [CommonModule, ...components, ...directives, ...pipes],
  providers: [...services, DatePipe],
})
export class SharedModule {}
