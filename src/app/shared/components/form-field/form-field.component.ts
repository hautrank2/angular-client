import { Component, Input } from '@angular/core';
import { ShFormField, ShFormOptions } from '../form/form.types';
import {
  ControlContainer,
  FormArray,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'sh-form-field',
  standalone: false,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class FormFieldComponent {
  @Input({ required: true }) field!: ShFormField;
  @Input() formGroup!: FormGroup;
  @Input() formOptions: ShFormOptions = {
    appearance: 'outline',
    isGrid: false,
    fieldAttrs: {},
  };

  constructor(private formSrv: FormService) {}

  get appearance() {
    return this.formOptions.appearance || 'fill';
  }

  get fieldAttrs() {
    return this.formOptions.fieldAttrs || {};
  }

  getFormArray(key: string): FormArray {
    return this.formGroup!.get(key) as FormArray;
  }

  getFormArrayGroup(arrayKey: string, index: number): FormGroup {
    return this.getFormArray(arrayKey).at(index) as FormGroup;
  }

  addArrayItem(field: ShFormField) {
    console.log(field);
    if (field.type === 'groupArray') {
      const array = this.getFormArray(field.key);
      console.log(array);
      const newGroup = this.formSrv.buildForm(field.arrayFields);
      console.log(newGroup);
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
