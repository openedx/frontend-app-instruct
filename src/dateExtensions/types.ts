export interface LearnerDateExtension {
  id: number,
  username: string,
  fullname: string,
  email: string,
  graded_subsection: string,
  extended_due_date: string,
}

export interface DateExtensionsResponse {
  count: number,
  next: string | null,
  previous: string | null,
  results: LearnerDateExtension[],
}
