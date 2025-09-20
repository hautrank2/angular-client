import { Type } from '@angular/core';
import { FormControlOptions, ValidatorFn } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';

export type ShValidatorOpts =
  | ValidatorFn
  | ValidatorFn[]
  | FormControlOptions
  | null;

export type ShFormOption = {
  value: string;
  label: string;
};

export interface ShGridConfig {
  itemLabel?: string;
  cols?: number;
  rowHeight?: number | string;
  col?: number;
  row?: number;
  gutter?: number;
}

export interface ShFormOptions {
  appearance?: MatFormFieldAppearance;
  fieldAttrs?: { [key: string]: any };
  isGrid?: boolean;
}

export const SH_DEFAULT_FORM_OPTIONS: ShFormOptions = {
  appearance: 'outline',
  fieldAttrs: {},
  isGrid: false,
};

// ─────────────────────────────────────────────
// 🧱 Base FormField Interface
// ─────────────────────────────────────────────

export interface ShBaseFormField {
  key: string;
  label?: string;
  value?: any;
  placeholder?: string;
  validators?: ShValidatorOpts;
  componentRef?: Type<any>;
  inputs?: { [key: string]: any };
  col?: number;
  row?: number;
  hidden?: boolean;

  isArray?: boolean;
  arrayConfig?: ShGridConfig;
}

// ─────────────────────────────────────────────
// 🧩 Specialized FormField Types
// ─────────────────────────────────────────────

export interface ShTextFormField extends ShBaseFormField {
  type: 'text' | 'number' | 'password' | 'date' | 'dateTime' | 'area';
}

export interface ShCheckboxFormField extends ShBaseFormField {
  type: 'checkbox';
}

export interface ShToggleFormField extends ShBaseFormField {
  type: 'toggle';
}

export interface ShSelectFormField extends ShBaseFormField {
  type: 'select';
  options: ShFormOption[];
  filter?: (enterValue: string) => ShFormOption[];
  debounceTime?: number;
}

export interface ShRadioFormField extends ShBaseFormField {
  type: 'radio';
  options: ShFormOption[];
}

export interface ShAutocompleteFormField extends ShBaseFormField {
  type: 'autocomplete';
  options: ShFormOption[];
  filter?: (enterValue: string) => ShFormOption[];
  debounceTime?: number;
}

export interface ShUploadFormField extends ShBaseFormField {
  type: 'upload';
  isArray?: false;
  variant?: 'default' | 'custom';
  multiple: boolean;
  accept?: string[]; // example:  ['image/jpeg', 'application/pdf']
  maxFileSize?: number; //Byte
  showPreview?: boolean;
  showProgress?: boolean;
}

export interface ShGroupFormField extends ShBaseFormField {
  type: 'group';
  fields: ShFormField[];
}

export interface ShGroupArrayFormField extends ShBaseFormField {
  type: 'groupArray';
  arrayFields: ShFormField[];
  config?: ShGridConfig;
  formOptions?: ShFormOptions;
}

export interface ShCustomFormField extends ShBaseFormField {
  type: 'custom';
}

export type ShFormFieldType =
  | 'text'
  | 'area'
  | 'number'
  | 'password'
  | 'date'
  | 'dateTime'
  | 'autocomplete'
  | 'select'
  | 'radio'
  | 'toggle'
  | 'upload'
  | 'group'
  | 'groupArray';

// ─────────────────────────────────────────────
// 🔗 Union Type for All FormField Variants
// ─────────────────────────────────────────────

export type ShFormField =
  | ShTextFormField
  | ShSelectFormField
  | ShRadioFormField
  | ShCheckboxFormField
  | ShToggleFormField
  | ShAutocompleteFormField
  | ShGroupFormField
  | ShUploadFormField
  | ShGroupArrayFormField
  | ShCustomFormField;
