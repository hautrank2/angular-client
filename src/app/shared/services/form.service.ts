import { Injectable } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormArray,
  FormControl,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  buildFormGroup(data: any): FormGroup {
    return new FormGroup(this.buildControls(data));
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
}
