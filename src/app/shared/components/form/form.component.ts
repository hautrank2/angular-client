import { Component, Injector, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FormField, FormOption, FormOptions } from './form.types';
import { FormService } from './form.service';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormWrapperComponent {
  @Input() fields: FormField[] = [];
  @Input() formGroup?: FormGroup;
  @Input() formOptions: FormOptions = {
    appearance: 'outline',
    isGrid: false,
    fieldAttrs: {},
  };

  constructor(
    private fb: FormBuilder,
    private injector: Injector,
    public formSrv: FormService
  ) {}

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.buildForm(this.fields);
    }
  }

  get appearance() {
    return this.formOptions.appearance || 'fill';
  }

  get fieldAttrs() {
    return this.formOptions.fieldAttrs || {};
  }

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

  removeArrayItem(name: string, index: number) {
    const array = this.getFormArray(name);
    array.removeAt(index);
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
