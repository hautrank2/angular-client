export type ApiResponse<T> = {
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
