export interface TablePaginationReq {
  page: number;
  pageSize: number;
}

export interface TablePagination extends TablePaginationReq {
  totalPage: number;
  page: number;
}
