import { Component, Input, signal } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs';
import {
  ShAutocompleteFormField,
  SH_DEFAULT_FORM_OPTIONS,
  ShFormOption,
  ShFormOptions,
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
  @Input() field!: ShAutocompleteFormField;
  @Input() formGroup!: FormGroup;
  @Input() formOptions: ShFormOptions = SH_DEFAULT_FORM_OPTIONS;

  autoInputCtrl = new FormControl('');
  filterdOptions = signal<ShFormOption[]>([]);

  constructor(
    private fb: FormBuilder,
    public formSrv: FormService,
  ) {}

  get fa() {
    return this.formGroup.get(this.field.key) as FormArray;
  }

  get options(): ShFormOption[] {
    return this.field.options || [];
  }

  ngOnInit() {
    this.filterdOptions.set(this.options);
    this.autoInputCtrl.valueChanges
      .pipe(debounceTime(this.field.debounceTime ?? 200))
      .subscribe((value) => {
        if (!value) {
          this.filterdOptions.set(this.options);
          return;
        }
        if (!!this.field.filter) {
          // Filter by filter function
          this.field.filter(value);
          this.filterdOptions.set(this.field.filter(value));
        } else {
          // Default Filter funtion
          this.filterdOptions.set(
            this.options.filter((opt) =>
              opt.label.toLowerCase().includes(value.toLowerCase()),
            ),
          );
        }
      });
  }

  getOptionLabel(
    value: any,
    options?: { label: string; value: any }[],
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
