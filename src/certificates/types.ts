export enum CertificateFilter {
  ALL_LEARNERS = 'all',
  RECEIVED = 'received',
  NOT_RECEIVED = 'not_received',
  AUDIT_PASSING = 'audit_passing',
  AUDIT_NOT_PASSING = 'audit_not_passing',
  ERROR_STATE = 'error',
  GRANTED_EXCEPTIONS = 'granted_exceptions',
  INVALIDATED = 'invalidated',
}

export enum CertificateStatus {
  RECEIVED = 'downloadable',
  NOT_RECEIVED = 'notpassing',
  AUDIT_PASSING = 'audit_passing',
  AUDIT_NOT_PASSING = 'audit_notpassing',
  ERROR_STATE = 'error',
}

export enum SpecialCase {
  NONE = '',
  INVALIDATION = 'invalidated',
  EXCEPTION = 'exception',
}

export interface CertificateData {
  username: string,
  email: string,
  enrollmentTrack: string,
  certificateStatus: CertificateStatus,
  specialCase: SpecialCase,
  exceptionGranted?: string,
  exceptionNotes?: string,
  invalidatedBy?: string,
  invalidationDate?: string,
  invalidationNote?: string,
}

export interface CertificateResponse {
  count: number,
  results: CertificateData[],
  numPages: number,
  next: string | null,
  previous: string | null,
}

export interface InstructorTask {
  taskId: string,
  taskName: string,
  taskState: string,
  taskOutput?: string,
  created: string,
  updated: string,
}

export interface InstructorTasksResponse {
  count: number,
  results: InstructorTask[],
  numPages: number,
  next: string | null,
  previous: string | null,
}

export interface PaginationParams {
  page: number,
  pageSize: number,
}

export interface CertificateQueryParams extends PaginationParams {
  filter: CertificateFilter,
  search: string,
}

export interface GrantExceptionRequest {
  learners: string,
  notes?: string,
}

export interface InvalidateCertificateRequest {
  learners: string,
  notes?: string,
}

export interface RemoveExceptionRequest {
  username: string,
}

export interface RemoveInvalidationRequest {
  username: string,
}
