export interface ShEntityResponse<T> {
  totalCount: number;
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
