import { TemplateRef, Type } from '@angular/core';
import { FormControlOptions, ValidatorFn } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Observable } from 'rxjs';

export type ShValidatorOpts =
  | ValidatorFn
  | ValidatorFn[]
  | FormControlOptions
  | null;

export type ShFormOptionType = ShFormOption[] | ShFormOptionSync;

export type ShFormOption = {
  value: string;
  label: string;
};

export type ShFormOptionPagination = {
  totalCount: number;
  totalPage: number;
  pageSize: number;
  pageIndex: number;
  items: ShFormOption[];
};

export type ShFormOptionSync = Observable<ShFormOption[]>;

// ─────────────────────────────────────────────
// ⚙️ Form options & grid config
// ─────────────────────────────────────────────
export type ShGridConfig = {
  itemLabel?: string;
  cols?: number;
  rowHeight?: number | string;
  col?: number;
  row?: number;
  gutter?: number;
};

export type ShFormOptions = {
  appearance?: MatFormFieldAppearance;
  fieldAttrs?: { [key: string]: any };
  isGrid?: boolean;
};

export const SH_DEFAULT_FORM_OPTIONS: ShFormOptions = {
  appearance: 'outline',
  fieldAttrs: {},
  isGrid: false,
};

// ─────────────────────────────────────────────
// 🧱 Base FormField Types
// ─────────────────────────────────────────────
export type ShBaseFormField = ShBaseFormFieldArray & {
  name: string;
  label?: string;
  defaultValue?: any;
  placeholder?: string;
  validators?: ShValidatorOpts;
  componentRef?: Type<any>;
  inputs?: { [key: string]: any };
  col?: number;
  row?: number;
  hidden?: boolean;
};

export type ShBaseFormFieldArray = {
  isArray?: boolean;
  arrayConfig?: ShGridConfig;
  formOptions?: ShFormOptions;
  arrayVariant?: 'default' | 'chips';
};

export type ShBaseSelectFormField = {
  multiple?: boolean;
  allOption?: boolean;
  isSearch?: boolean;
};

// ─────────────────────────────────────────────
// 🧩 Specialized FormField Types
// ─────────────────────────────────────────────
export type ShTextFormField = ShBaseFormField & {
  type: 'text' | 'number' | 'password' | 'date' | 'area';
};

export type ShCheckboxFormField = ShBaseFormField & {
  type: 'checkbox';
};

export type ShToggleFormField = ShBaseFormField & {
  type: 'toggle';
};

export type ShSelectFormField = ShBaseFormField &
  ShBaseSelectFormField & {
    type: 'select';
    options: ShFormOption[];
    filter?: (enterValue: string) => ShFormOption[];
    debounceTime?: number;
  };

export type ShSelectSearchFormField = ShBaseFormField &
  ShBaseSelectFormField & {
    type: 'selectSearch';
    options: ShFormOption[] | ShFormOptionSync;
    filter?: (enterValue: string) => ShFormOption[];
    debounceTime?: number;
  };

export type ShRadioFormField = ShBaseFormField & {
  type: 'radio';
  options: ShFormOption[];
};

export type ShAutocompleteFormField = ShBaseFormField &
  ShBaseSelectFormField & {
    type: 'autocomplete';
    options: ShFormOption[] | ShFormOptionSync;
    filter?: (enterValue: string) => ShFormOption[];
    debounceTime?: number;
  };

export type ShUploadFormField = ShBaseFormField & {
  type: 'upload';
  isArray?: false;
  variant?: 'default' | 'custom';
  multiple: boolean;
  accept?: string[]; // e.g. ['image/jpeg', 'application/pdf']
  maxFileSize?: number; // Byte
  showPreview?: boolean;
  showProgress?: boolean;
};

export type ShGroupFormField = ShBaseFormField & {
  type: 'group';
  fields: ShFormField[];
  gridConfig?: ShGridConfig;
};

export type ShGroupArrayFormField = ShBaseFormField & {
  type: 'groupArray';
  arrayFields: ShFormField[];
  config?: ShGridConfig;
  formOptions?: ShFormOptions;
};

export type ShCustomFormField = ShBaseFormField & {
  type: 'custom';
  renderTemplate: TemplateRef<any>;
};

export type ShFormFieldType =
  | 'text'
  | 'area'
  | 'number'
  | 'password'
  | 'date'
  | 'autocomplete'
  | 'select'
  | 'selectSearch'
  | 'radio'
  | 'toggle'
  | 'upload'
  | 'group'
  | 'groupArray';

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
  | ShSelectSearchFormField
  | ShCustomFormField;
