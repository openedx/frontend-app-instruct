export interface TableCellValue<T> {
  row: {
    original: T,
  },
}

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
