export interface LearnerDateExtension {
  username: string,
  fullName: string,
  email: string,
  unitTitle: string,
  extendedDueDate: string,
  unitLocation: string,
}

export interface ResetDueDateParams {
  student: string,
  url: string,
  reason?: string,
}

export interface AddDateExtensionParams {
  emailOrUsername: string,
  blockId: string,
  dueDatetime: string,
  reason: string,
}
