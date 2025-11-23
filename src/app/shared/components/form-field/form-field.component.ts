import { Component, Input, signal, ViewEncapsulation } from '@angular/core';
import {
  ShFormField,
  ShFormOptions,
  ShFormOptionSync,
} from '../form/form.types';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { FormService } from '../../services/form.service';
import { of } from 'rxjs';

@Component({
  selector: 'sh-form-field',
  standalone: false,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldComponent {
  @Input({ required: true }) field!: ShFormField;
  @Input() formGroup!: FormGroup;
  @Input() fieldIndex!: number;
  @Input() formOptions: ShFormOptions = {
    appearance: 'outline',
    isGrid: false,
    fieldAttrs: {},
  };
  helpText = signal<string[]>([]);

  constructor(private formSrv: FormService) {}

  ngOnInit(): void {
    if (this.formGroup) {
      this.formGroup.valueChanges.subscribe((res) => {
        const ctrErrors = this.formGroup.get(this.field.name)?.errors ?? {};
        const keys = Object.keys(ctrErrors);
        if (keys.length > 0) {
          this.helpText.set(
            keys
              .map((key: string) => ctrErrors[key])
              .filter((e) => typeof e === 'string'),
          );
        } else {
          this.helpText.set([]);
        }
      });
    }
  }

  get appearance() {
    return this.formOptions.appearance || 'fill';
  }

  get fieldAttrs() {
    return this.formOptions.fieldAttrs || {};
  }

  get errorText() {
    if (!this.formGroup) return;
    const ctrErrors = this.formGroup.get(this.field.name)?.errors ?? {};
    Object(ctrErrors)
      .names()
      .forEach((e: string) => {
        console.log('err', e, ctrErrors[e]);
      });
    return 'Something error';
  }

  get options$(): ShFormOptionSync {
    if (this.field.type === 'select') {
      return Array.isArray(this.field.options)
        ? of(this.field.options)
        : this.field.options;
    }
    return of([]);
  }

  getFormArray(key: string): FormArray {
    return this.formGroup!.get(key) as FormArray;
  }

  getFormArrayGroup(arrayKey: string, index: number): FormGroup {
    return this.getFormArray(arrayKey).at(index) as FormGroup;
  }

  addArrayItem(field: ShFormField) {
    if (!field.isArray) return;

    const array = this.getFormArray(field.name);

    switch (field.type) {
      case 'group': {
        const fg = this.formSrv.buildForm(field.fields, field.defaultValue);
        array.push(fg);
        break;
      }
      default: {
        const control = new FormControl(
          field.defaultValue ?? null,
          field.validators as any,
        );
        array.push(control);
        break;
      }
    }
  }

  addGroupArrayItem(field: ShFormField) {
    if (field.type === 'groupArray') {
      const array = this.getFormArray(field.name);
      const newGroup = this.formSrv.buildForm(field.arrayFields);
      array.push(newGroup);
    }
  }

  removeArrayItem(name: string, index: number) {
    const array = this.getFormArray(name);
    array.removeAt(index);
  }

  toString(number: number) {
    return String(number).toString();
  }
}
