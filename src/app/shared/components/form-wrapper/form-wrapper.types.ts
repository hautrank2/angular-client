import { Type } from '@angular/core';
import { FormControlOptions, ValidatorFn } from '@angular/forms';

export type ValidatorOpts =
  | ValidatorFn
  | ValidatorFn[]
  | FormControlOptions
  | null;

export type FormFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'radio'
  | 'date'
  | 'checkbox'
  | 'group'
  | 'array'
  | 'custom';

export interface FormField {
  key: string;
  label?: string;
  type: FormFieldType;
  value?: any;
  validators?: ValidatorOpts;
  options?: { label: string; value: any }[];
  fields?: FormField[];
  arrayFields?: FormField[];
  componentRef?: Type<any>;
  inputs?: { [key: string]: any };
  col?: number;
  row?: number;
  hidden?: boolean;
}
