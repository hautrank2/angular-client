import { Injectable } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormArray,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import {
  ShFormField,
  ShFormOption,
  ShGroupArrayFormField,
  ShGroupFormField,
} from '../components/form/form.types';
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

  //#region Build form
  buildForm(fields: ShFormField[]): FormGroup {
    const group: any = {};
    for (const field of fields) {
      if (field.isArray) {
        group[field.key] = this.fb.array([]);
      } else {
        switch (field.type) {
          case 'group':
            group[field.key] = this.buildForm(
              (field as ShGroupFormField).fields || [],
            );
            break;
          case 'groupArray':
            group[field.key] = this.fb.array([]);
            break;

          default:
            group[field.key] = new FormControl(
              field.value ?? '',
              field.validators || [],
            );
        }
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

  //#endregion

  //#region FORMDATA
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
  //#endregion

  //#region change value form
  patchForm(
    form: FormGroup,
    values: Record<string, any>,
    fields: ShFormField[],
  ) {
    fields.forEach((field) => {
      this.patchFormValue(form, values, field);
    });
  }

  patchFormValue(
    form: FormGroup,
    values: Record<string, any>,
    field: ShFormField,
  ) {
    if (field.isArray) {
      this.patchFormArray(form, values[field.key], field);
    } else {
      switch (field.type) {
        case 'group':
          this.patchForm(form, values[field.key], field.fields);
          break;
        case 'groupArray':
          this.patchFormGroupArray(form, values[field.key], field);
          break;
        default:
          this.appendValueToForm(form, values[field.key], field);
      }
    }
  }

  patchFormArray(form: FormGroup, values: any[], field: ShFormField) {
    const formArray = form.get(field.key) as FormArray;
    if (Array.isArray(values)) {
      values.forEach((value) => {
        formArray.push(new FormControl(value, field.validators));
      });
    }
  }

  patchFormGroupArray(
    form: FormGroup,
    values: Record<string, any>[],
    field: ShGroupArrayFormField,
  ) {
    const formArray = form.get(field.key) as FormArray;
    if (Array.isArray(values)) {
      values.forEach((value) => {
        const formGroup = this.buildForm(field.arrayFields);
        formGroup.patchValue(value);
        formArray.push(formGroup);
      });
    }
  }

  appendValueToForm(form: FormGroup, value: any, field: ShFormField) {
    const control = form.get(field.key) as FormControl;
    if (!control) {
      console.error('Form dont have control name is ', field.key);
    }
    switch (field.type) {
      case 'number':
        if (typeof value === 'number') {
          control.setValue(value);
        } else {
          console.error(`Value is not a number with key: ${field.key}`);
        }
        break;
      default:
        control.setValue(value);
        break;
    }
  }

  //#endregion

  //#region Table form
  buildTableForm(columns: ShColumn[]): FormGroup {
    const formFields: ShFormField[] = [
      {
        key: 'rows',
        type: 'groupArray',
        arrayFields: this.convertTableColsToFormField(columns),
      },
    ];
    return this.buildForm(formFields);
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

      case 'chips':
        return {
          ...baseField,
          type: 'text',
          isArray: true,
        };
      default:
        throw new Error(`Unsupported column type: ${(column as any).type}`);
    }
  }

  //#endregion

  //#region Validate
  filesValidate() {
    return (control: FormControl) => {
      const value = control.value;
      if (value && value.length === 0) {
        return { noFiles: 'At least one file must be selected' }; // Lỗi nếu không chọn file
      }
      if (!Array.isArray(value)) {
        return { invalidType: 'Files must be an array' };
      }

      return null;
    };
  }

  fileValidator() {
    return (control: FormControl) => {
      const value = control.value;
      if (Array.isArray(value) && value.length > 1) {
        return { multipleFiles: 'Only one file can be selected' }; // Lỗi nếu chọn nhiều hơn 1 file
      }
      if (value && !(value instanceof File)) {
        return { invalidType: 'You must select a single file' }; // Lỗi nếu không phải là File
      }
      return null;
    };
  }
  //#endregion Validate
}
