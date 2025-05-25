import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormField, FormOption } from './form.types';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  //#region Ultility
  buildForm(fields: FormField[]): FormGroup {
    const group: any = {};
    for (const field of fields) {
      if (field.type === 'group') {
        group[field.key] = this.buildForm(field.fields || []);
      } else if (
        (field.type === 'array' && field.arrayFields) ||
        field.type === 'autocomplete'
      ) {
        group[field.key] = this.fb.array([]);
      } else {
        group[field.key] = new FormControl(
          field.value || '',
          field.validators || []
        );
      }
    }
    return this.fb.group(group);
  }

  getLabelFromValue(value: string, options: FormOption[]): string {
    return options.find((e) => e.value === value)?.label ?? '';
  }
  //#endregion
}
