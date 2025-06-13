export type PaginationResponse<T> = {
  totalCount: number;
  totalPage: number;
  pageSize: number;
  page: number;
  items: T[];
};

export const API_REPONSE_BASE = {
  totalCount: 0,
  totalPage: 0,
  pageSize: 0,
  page: 0,
  items: [],
};

export type ApiPaginationQuery = {
  pageSize: number;
  page: number;
  [key: string]: any;
};

export type DocumentResponse = {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type RequestQuery = {
  [key: string]: any;
};
