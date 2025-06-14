import { Component, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ShFormField, ShFormOptions } from './form.types';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormWrapperComponent {
  @Input() fields: ShFormField[] = [];
  @Input() formGroup!: FormGroup;
  @Input() formOptions: ShFormOptions = {
    appearance: 'outline',
    isGrid: false,
    fieldAttrs: {},
  };
  @Input() hideFooter: boolean = false;

  constructor(public formSrv: FormService) {}

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.formSrv.buildForm(this.fields);
      this.formGroup.valueChanges.subscribe((res) => {
        console.log('Form changes:', res);
      });
    }
  }

  get appearance() {
    return this.formOptions.appearance || 'fill';
  }

  get fieldAttrs() {
    return this.formOptions.fieldAttrs || {};
  }

  reset() {
    this.formGroup?.reset();
  }

  submit() {
    console.log('Form submit()', this.formGroup?.getRawValue());
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

  addArrayItem(field: ShFormField) {
    if (field.type === 'array') {
      const array = this.getFormArray(field.key);
      const newGroup = this.formSrv.buildForm(field.arrayFields);
      array.push(newGroup);
    }
  }

  removeArrayItem(name: string, index: number) {
    const array = this.getFormArray(name);
    array.removeAt(index);
  }

  // createInjector(field: ShFormField): Injector {
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
