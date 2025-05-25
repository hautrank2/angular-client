import { Type } from '@angular/core';
import { FormControlOptions, ValidatorFn } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { DynamicAttrType } from '../../directives/attr.directive';

export type ValidatorOpts =
  | ValidatorFn
  | ValidatorFn[]
  | FormControlOptions
  | null;

export type FormFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'autocomplete'
  | 'radio'
  | 'date'
  | 'checkbox'
  | 'group'
  | 'array'
  | 'custom';

export type FormOption = {
  value: string;
  label: string;
};

export interface FormOptions {
  appearance?: MatFormFieldAppearance;
  fieldAttrs?: DynamicAttrType;
  isGrid?: boolean;
}

export const DEFAULT_FORM_OPTIONS: FormOptions = {
  appearance: 'outline',
  fieldAttrs: {},
  isGrid: false,
};

export interface FormArrayOptions {
  cols?: number;
  rowHeight?: number | string;
  col?: number;
  row?: number;
  gutter?: number;
}

export interface SelectOptions {
  filter?: (enterValue: string) => FormOption[];
  debounceTime?: number;
}

export interface AutocompleteOptions extends SelectOptions {}

export interface FormField {
  key: string;
  label?: string;
  type: FormFieldType;
  value?: any;
  validators?: ValidatorOpts;
  options?: FormOption[];
  fields?: FormField[];
  placeholder?: string;

  // Select
  selectOptions?: SelectOptions;

  // Array Config
  formArrayOptions?: FormArrayOptions;
  arrayFields?: FormField[];

  //Auto complete
  autocompleteOptions?: AutocompleteOptions;

  componentRef?: Type<any>;
  inputs?: { [key: string]: any };
  col?: number;
  row?: number;
  hidden?: boolean;
}
