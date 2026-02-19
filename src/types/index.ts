export interface TableCellValue<T> {
  row: {
    original: T,
  },
}

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

export interface PendingTask {
  taskType: string,
  taskInput: Record<string, any>,
  taskId: string,
  requester: string,
  taskState: string,
  created: string,
  taskOutput: Record<string, any> | null,
  durationSec: number,
  status: string,
  taskMessage: string,
}
