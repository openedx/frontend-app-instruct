export interface PaginationQueryKeys {
  page: number,
  pageSize: number,
}

export interface APIError {
  response: {
    data: {
      error: string,
    },
  },
};

export interface DataList<T> {
  count: number,
  next: string | null,
  previous: string | null,
  numPages: number,
  results: T[],
};
