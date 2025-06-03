import { Injectable } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormArray,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import {
  FormField,
  FormFieldType,
  FormOption,
} from '../components/form/form.types';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private fb: FormBuilder) {}

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

  private buildControls(data: any): { [key: string]: AbstractControl } {
    const controls: { [key: string]: AbstractControl } = {};

    for (const key in data) {
      if (!data.hasOwnProperty(key)) continue;

      const value = data[key];

      if (Array.isArray(value)) {
        controls[key] = this.buildControlArray(value);
      } else if (typeof value === 'object' && value !== null) {
        controls[key] = new FormGroup(this.buildControls(value));
      } else {
        controls[key] = new FormControl(value);
      }
    }

    return controls;
  }

  private buildControlArray(array: any[]): FormArray {
    return new FormArray(
      array.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return new FormGroup(this.buildControls(item));
        } else {
          return new FormControl(item);
        }
      })
    );
  }

  buildFormData(
    obj: any,
    formData: FormData = new FormData(),
    parentKey: string | null = null
  ): FormData {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const value = obj[key];
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File) {
        formData.append(fullKey, value);
      } else if (value instanceof Date) {
        // Convert Date to ISO string
        formData.append(fullKey, value.toISOString());
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (
            typeof item === 'object' &&
            !(item instanceof File) &&
            !(item instanceof Date)
          ) {
            this.buildFormData(item, formData, `${fullKey}[${index}]`);
          } else if (item instanceof Date) {
            formData.append(`${fullKey}[${index}]`, item.toISOString());
          } else {
            formData.append(`${fullKey}[]`, item);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        this.buildFormData(value, formData, fullKey);
      } else if (value !== undefined && value !== null) {
        formData.append(fullKey, value);
      }
    }

    return formData;
  }
}
