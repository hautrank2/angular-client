import { Component, Injector, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FormField } from './form-wrapper.types';
import { DynamicAttrType } from '../../directives/attr.directive';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'app-form-wrapper',
  standalone: false,
  templateUrl: './form-wrapper.component.html',
  styleUrl: './form-wrapper.component.scss',
})
export class FormWrapperComponent {
  @Input() fields: FormField[] = [];
  @Input() formGroup?: FormGroup;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() fieldAttrs: DynamicAttrType = {};

  constructor(private fb: FormBuilder, private injector: Injector) {}

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.buildForm(this.fields);
      console.log(this.formGroup);
    }
  }

  buildForm(fields: FormField[]): FormGroup {
    const group: any = {};
    for (const field of fields) {
      if (field.type === 'group') {
        group[field.key] = this.buildForm(field.fields || []);
      } else if (field.type === 'array' && field.arrayFields) {
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

  getFormGroupForKey(key: string): FormGroup {
    return this.formGroup!.get(key) as FormGroup;
  }

  getFormArray(key: string): FormArray {
    return this.formGroup!.get(key) as FormArray;
  }

  getFormArrayGroup(arrayKey: string, index: number): FormGroup {
    return this.getFormArray(arrayKey).at(index) as FormGroup;
  }

  addArrayItem(field: FormField) {
    const array = this.getFormArray(field.key);
    const newGroup = this.buildForm(field.arrayFields || []);
    array.push(newGroup);
  }

  // createInjector(field: FormField): Injector {
  //   const tokens = new WeakMap();
  //   tokens.set(FormControl, this.formGroup!.get(field.key));
  //   if (field.inputs) {
  //     for (const [key, val] of Object.entries(field.inputs)) {
  //       tokens.set(new InjectionToken(key), val);
  //     }
  //   }
  //   return Injector.create({
  //     providers: Array.from(tokens.entries()).map(
  //       ([token, val]): StaticProvider => ({
  //         provide: token,
  //         useValue: val,
  //       })
  //     ),
  //     parent: this.injector,
  //   });
  // }
}
