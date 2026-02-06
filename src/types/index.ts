export interface DataList<T> {
  count: number,
  next: string | null,
  previous: string | null,
  numPages: number,
  results: T[],
};
