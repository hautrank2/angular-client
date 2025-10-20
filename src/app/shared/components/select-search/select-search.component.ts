import {
  Component,
  effect,
  Input,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { catchError, debounceTime, of } from 'rxjs';
import {
  SH_DEFAULT_FORM_OPTIONS,
  ShFormOption,
  ShFormOptions,
  ShSelectSearchFormField,
} from '../form/form.types';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { FormService } from '../../services/form.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'sh-select-search',
  standalone: false,
  templateUrl: './select-search.component.html',
  styleUrl: './select-search.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SelectSearchComponent {
  @Input() field!: ShSelectSearchFormField;
  @Input() formGroup!: FormGroup;
  @Input() formOptions: ShFormOptions = SH_DEFAULT_FORM_OPTIONS;
  @Input() helpText: string[] = [];
  @ViewChild('input', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

  open = signal(false);
  options = signal<ShFormOption[]>([]);
  searchCtrl = new FormControl('');
  filterdOptions = signal<ShFormOption[]>([]);
  errorText = signal<string>('');
  selectedAll = signal<boolean>(false);

  constructor(public formSrv: FormService) {
    effect(() => {
      this.filterdOptions.set(this.options());
    });
  }

  get formControl() {
    return this.formGroup.get(this.field.name) as FormControl<any[]>;
  }

  get value() {
    return this.formControl.value as any[];
  }

  ngOnInit() {
    this.fetchOptions();

    this.searchCtrl.valueChanges
      .pipe(debounceTime(this.field.debounceTime ?? 200))
      .subscribe((value) => {
        if (!value) {
          this.filterdOptions.set(this.options());
          return;
        }
        if (!!this.field.filter) {
          // Filter by filter function
          this.field.filter(value);
          this.filterdOptions.set(this.field.filter(value));
        } else {
          // Default Filter funtion
          this.filterdOptions.set(
            this.options().filter((opt) =>
              opt.label.toLowerCase().includes(value.toLowerCase()),
            ),
          );
        }
      });
  }

  fetchOptions() {
    if (Array.isArray(this.field.options)) {
      this.options.set(this.field.options);
    } else {
      this.field.options
        .pipe(
          catchError((err: any) => {
            this.errorText.set(
              typeof err === 'string' ? err : 'No items found',
            );
            return of([]);
          }),
        )
        .subscribe((res) => {
          this.options.set(res);
          if (res.length === 0) {
            this.errorText.set('No items found');
          }
        });
    }
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
    const selectedValue = event.option.value;
    this.formControl.setValue([...this.value, selectedValue]);
    this.searchCtrl.setValue('');
  }

  changeSelect(event: MatSelectChange) {}

  removeArrayItem(index: number) {
    const result = this.value.slice();
    result.splice(index, 1);
    this.formControl.setValue(result);
  }

  findOption(value: string): boolean {
    return !!this.filterdOptions().find((e) => e.value === value);
  }

  toggleAll(): void {
    if (this.selectedAll()) {
      this.formControl.setValue([]);
      this.selectedAll.set(false);
    } else {
      const allValues = this.options().map((opt) => opt.value);
      this.formControl.setValue(allValues);
      this.selectedAll.set(true);
    }
  }
}
