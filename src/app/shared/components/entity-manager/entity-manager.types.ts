import { ShFormField } from '../form/form.types';

export interface ShEntityResponse<T> {
  total: number;
  pageSize: number;
  page: number;
  items: T[];
}

export interface ShEntityFilter {
  page: number;
  pageSize: number;
  [key: string]: any;
}

export type ShEntityAction = 'edit' | 'delete';

export type EntityForm = {
  reqBody: 'json' | 'form';
};

export const DEFAULT_FORM_CONFIG: EntityForm = {
  reqBody: 'json',
};
