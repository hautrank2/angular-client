import { Type } from '@angular/core';

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
  validators?: any[];
  options?: { label: string; value: any }[];
  fields?: FormField[];
  arrayField?: FormField;
  componentRef?: Type<any>;
  inputs?: { [key: string]: any };
  col?: number;
  row?: number;
  hidden?: boolean;
}
