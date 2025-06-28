export interface ShEntityResponse<T> {
  total: number;
  totalPage: number;
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
