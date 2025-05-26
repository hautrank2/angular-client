import { Component, Input, signal } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs';
import {
  AutocompleteOptions,
  DEFAULT_FORM_OPTIONS,
  FormField,
  FormOption,
  FormOptions,
} from '../form/form.types';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  standalone: false,
})
export class AutocompleteComponent {
  @Input() field!: FormField;
  @Input() formGroup!: FormGroup;
  @Input() formOptions: FormOptions = DEFAULT_FORM_OPTIONS;

  autoInputCtrl = new FormControl('');
  filterdOptions = signal<FormOption[]>([]);

  constructor(private fb: FormBuilder, public formSrv: FormService) {}

  get fa() {
    return this.formGroup.get(this.field.key) as FormArray;
  }

  get options(): FormOption[] {
    return this.field.options || [];
  }

  get autocompleteOptions(): AutocompleteOptions | undefined {
    return this.field.autocompleteOptions;
  }

  ngOnInit() {
    this.filterdOptions.set(this.options);
    this.autoInputCtrl.valueChanges
      .pipe(debounceTime(this.field.autocompleteOptions?.debounceTime ?? 200))
      .subscribe((value) => {
        if (!value) {
          this.filterdOptions.set(this.options);
          return;
        }
        if (!!this.autocompleteOptions?.filter) {
          // Filter by filter function
          this.autocompleteOptions?.filter(value);
          this.filterdOptions.set(this.autocompleteOptions.filter(value));
        } else {
          // Default Filter funtion
          this.filterdOptions.set(
            this.options.filter((opt) =>
              opt.label.toLowerCase().includes(value.toLowerCase())
            )
          );
        }
      });
  }

  getOptionLabel(
    value: any,
    options?: { label: string; value: any }[]
  ): string {
    return options?.find((opt) => opt.value === value)?.label || value;
  }

  getFormArray(key: string): FormArray {
    return this.formGroup!.get(key) as FormArray;
  }

  addItem(event: MatAutocompleteSelectedEvent) {
    this.fa.push(this.fb.control(event.option.value));
    this.autoInputCtrl.setValue('');
  }

  removeArrayItem(index: number) {
    this.fa.removeAt(index);
  }
}
