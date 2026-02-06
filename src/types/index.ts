export interface ListData<T> {
  count: number,
  next: string | null,
  previous: string | null,
  numPages: number,
  results: T[],
};
