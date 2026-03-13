export interface IssuedCertificate {
  username: string,
  email: string,
  enrollmentTrack: string,
  certificateStatus: string,
  specialCase: string | null,
  exceptionGranted: string | null,
  exceptionNotes: string | null,
  invalidatedBy: string | null,
  invalidationDate: string | null,
}

export interface CertificateGenerationHistory {
  taskName: string,
  date: string,
  details: string,
}

export interface RegenerateCertificatesParams {
  statuses?: string[],
  studentSet?: 'all' | 'allowlisted',
}

export type CertificateFilter =
  | 'all'
  | 'received'
  | 'not_received'
  | 'audit_passing'
  | 'audit_not_passing'
  | 'error'
  | 'granted_exceptions'
  | 'invalidated';
