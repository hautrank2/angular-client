import { Injectable } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormArray,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { ShFormField, ShFormOption } from '../components/form/form.types';
import {
  ShColumn,
  ShRadioColumn,
  ShSelectColumn,
} from '../components/table/table.types';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  buildForm(fields: ShFormField[]): FormGroup {
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
          field.validators || [],
        );
      }
    }
    return this.fb.group(group);
  }

  getLabelFromValue(value: string, options: ShFormOption[]): string {
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
      }),
    );
  }

  buildFormData(
    obj: any,
    formData: FormData = new FormData(),
    parentKey: string | null = null,
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

  convertTableColsToFormField(columns: ShColumn[]): ShFormField[] {
    return columns.map((col) => this.convertTableColToFormField(col));
  }

  convertTableColToFormField(column: ShColumn): ShFormField {
    const baseField = {
      key: column.key,
      label: column.label,
      col: 12,
      row: 1,
      hidden: false,
      validators: undefined,
    };

    switch (column.type) {
      case 'text':
      case 'number':
      case 'date':
      // case 'password':
      //   return {
      //     ...baseField,
      //     type: column.type,
      //     placeholder: column.label,
      //   } as ShFormField;

      case 'select':
      case 'radio': {
        const options =
          (column as ShSelectColumn | ShRadioColumn).options || [];

        return {
          ...baseField,
          type: column.type,
          options: options as ShFormOption[],
        } as ShFormField;
      }

      // case 'autocomplete': {
      //   const ac = column as any; // nếu bạn có thêm autocomplete column riêng
      //   return {
      //     ...baseField,
      //     type: 'autocomplete',
      //     options: ac.options || [],
      //     filter: ac.filter,
      //     debounceTime: ac.debounceTime,
      //   } as ShAutocompleteFormField;
      // }

      case 'custom':
      case 'toggle':
      case 'status':
      case 'statusList':
      case 'iconText':
      case 'actions':
      case 'time':
        return {
          ...baseField,
          type: 'text',
        };

      default:
        throw new Error(`Unsupported column type: ${(column as any).type}`);
    }
  }
}
