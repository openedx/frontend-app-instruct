export interface LearnerDateExtension {
  username: string,
  fullName: string,
  email: string,
  unitTitle: string,
  extendedDueDate: string,
  unitLocation: string,
}

export interface DateExtensionsResponse {
  count: number,
  next: string | null,
  previous: string | null,
  results: LearnerDateExtension[],
}

export interface ResetDueDateParams {
  student: string,
  url: string,
  reason?: string,
}
