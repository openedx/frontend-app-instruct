export interface LearnerDateExtension {
  id: number,
  username: string,
  fullName: string,
  email: string,
  unitTitle: string,
  extendedDueDate: string,
}

export interface DateExtensionsResponse {
  count: number,
  next: string | null,
  previous: string | null,
  results: LearnerDateExtension[],
}
