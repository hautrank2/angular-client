import { NgModule } from '@angular/core';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const materialModules = [
  MatButtonModule,
  MatIconModule,
  MatDividerModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatCardModule,
  MatToolbarModule,
  MatInputModule,
  MatSelectModule,
  MatMenuModule,
  MatDialogModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatSortModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatChipsModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatStepperModule,
  MatListModule,
  MatGridListModule,
  MatTreeModule,
  MatIconModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatAutocompleteModule,
];

@NgModule({
  imports: [...materialModules],
  exports: [...materialModules],
})
export class UiModule {}
