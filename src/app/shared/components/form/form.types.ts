import { Type } from '@angular/core';
import { FormControlOptions, ValidatorFn } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';

export type ValidatorOpts =
  | ValidatorFn
  | ValidatorFn[]
  | FormControlOptions
  | null;

export type FormOption = {
  value: string;
  label: string;
};

export interface config {
  itemLabel?: string;
  cols?: number;
  rowHeight?: number | string;
  col?: number;
  row?: number;
  gutter?: number;
}

export interface FormOptions {
  appearance?: MatFormFieldAppearance;
  fieldAttrs?: { [key: string]: any };
  isGrid?: boolean;
}

export const DEFAULT_FORM_OPTIONS: FormOptions = {
  appearance: 'outline',
  fieldAttrs: {},
  isGrid: false,
};

// ─────────────────────────────────────────────
// 🧱 Base FormField Interface
// ─────────────────────────────────────────────

export interface BaseFormField {
  key: string;
  label?: string;
  value?: any;
  placeholder?: string;
  validators?: ValidatorOpts;
  componentRef?: Type<any>;
  inputs?: { [key: string]: any };
  col?: number;
  row?: number;
  hidden?: boolean;
}

// ─────────────────────────────────────────────
// 🧩 Specialized FormField Types
// ─────────────────────────────────────────────

export interface TextFormField extends BaseFormField {
  type: 'text' | 'number' | 'password' | 'date';
}

export interface CheckboxFormField extends BaseFormField {
  type: 'checkbox';
}

export interface SelectFormField extends BaseFormField {
  type: 'select';
  options: FormOption[];
  filter?: (enterValue: string) => FormOption[];
  debounceTime?: number;
}

export interface RadioFormField extends BaseFormField {
  type: 'radio';
  options: FormOption[];
}

export interface AutocompleteFormField extends BaseFormField {
  type: 'autocomplete';
  options: FormOption[];
  filter?: (enterValue: string) => FormOption[];
  debounceTime?: number;
}

export interface GroupFormField extends BaseFormField {
  type: 'group';
  fields: FormField[];
}

export interface ArrayFormField extends BaseFormField {
  type: 'array';
  arrayFields: FormField[];
  config?: config;
}

export interface CustomFormField extends BaseFormField {
  type: 'custom';
}

export type FormFieldType =
  | 'text'
  | 'number'
  | 'password'
  | 'date'
  | 'autocomplete'
  | 'select'
  | 'radio'
  | 'group'
  | 'array';

// ─────────────────────────────────────────────
// 🔗 Union Type for All FormField Variants
// ─────────────────────────────────────────────

export type FormField =
  | TextFormField
  | SelectFormField
  | RadioFormField
  | CheckboxFormField
  | AutocompleteFormField
  | GroupFormField
  | ArrayFormField
  | CustomFormField;
