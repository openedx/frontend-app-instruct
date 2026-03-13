import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  certificatesTitle: {
    id: 'certificates.title',
    defaultMessage: 'Certificates',
    description: 'Title for certificates page',
  },
  issuedCertificatesTab: {
    id: 'certificates.issuedCertificates.tab',
    defaultMessage: 'Issued Certificates',
    description: 'Tab label for issued certificates',
  },
  generationHistoryTab: {
    id: 'certificates.generationHistory.tab',
    defaultMessage: 'Certificate Generation History',
    description: 'Tab label for certificate generation history',
  },
  searchPlaceholder: {
    id: 'certificates.search.placeholder',
    defaultMessage: 'Search for a Learner',
    description: 'Placeholder for search input',
  },
  allLearners: {
    id: 'certificates.filter.allLearners',
    defaultMessage: 'All Learners',
    description: 'Filter option for all learners',
  },
  received: {
    id: 'certificates.filter.received',
    defaultMessage: 'Received',
    description: 'Filter option for received certificates',
  },
  notReceived: {
    id: 'certificates.filter.notReceived',
    defaultMessage: 'Not Received',
    description: 'Filter option for not received certificates',
  },
  auditPassing: {
    id: 'certificates.filter.auditPassing',
    defaultMessage: 'Audit - Passing',
    description: 'Filter option for audit passing',
  },
  auditNotPassing: {
    id: 'certificates.filter.auditNotPassing',
    defaultMessage: 'Audit - Not Passing',
    description: 'Filter option for audit not passing',
  },
  errorState: {
    id: 'certificates.filter.errorState',
    defaultMessage: 'Error State',
    description: 'Filter option for error state',
  },
  grantedExceptions: {
    id: 'certificates.filter.grantedExceptions',
    defaultMessage: 'Granted Exceptions',
    description: 'Filter option for granted exceptions',
  },
  invalidated: {
    id: 'certificates.filter.invalidated',
    defaultMessage: 'Invalidated',
    description: 'Filter option for invalidated certificates',
  },
  regenerateCertificates: {
    id: 'certificates.regenerate.button',
    defaultMessage: 'Regenerate Certificates',
    description: 'Button text for regenerating certificates',
  },
  regenerating: {
    id: 'certificates.regenerate.inProgress',
    defaultMessage: 'Regenerating...',
    description: 'Button text while regenerating certificates',
  },
  username: {
    id: 'certificates.table.username',
    defaultMessage: 'Username',
    description: 'Table column header for username',
  },
  email: {
    id: 'certificates.table.email',
    defaultMessage: 'Email',
    description: 'Table column header for email',
  },
  enrollmentTrack: {
    id: 'certificates.table.enrollmentTrack',
    defaultMessage: 'Enrollment Track',
    description: 'Table column header for enrollment track',
  },
  certificateStatus: {
    id: 'certificates.table.certificateStatus',
    defaultMessage: 'Certificate Status',
    description: 'Table column header for certificate status',
  },
  specialCase: {
    id: 'certificates.table.specialCase',
    defaultMessage: 'Special Case',
    description: 'Table column header for special case',
  },
  exceptionGranted: {
    id: 'certificates.table.exceptionGranted',
    defaultMessage: 'Exception Granted',
    description: 'Table column header for exception granted',
  },
  exceptionNotes: {
    id: 'certificates.table.exceptionNotes',
    defaultMessage: 'Exception Notes',
    description: 'Table column header for exception notes',
  },
  invalidatedBy: {
    id: 'certificates.table.invalidatedBy',
    defaultMessage: 'Invalidated By',
    description: 'Table column header for invalidated by',
  },
  invalidationDate: {
    id: 'certificates.table.invalidationDate',
    defaultMessage: 'Invalidation Date',
    description: 'Table column header for invalidation date',
  },
  taskName: {
    id: 'certificates.history.taskName',
    defaultMessage: 'Task Name',
    description: 'Table column header for task name',
  },
  date: {
    id: 'certificates.history.date',
    defaultMessage: 'Date',
    description: 'Table column header for date',
  },
  details: {
    id: 'certificates.history.details',
    defaultMessage: 'Details',
    description: 'Table column header for details',
  },
  regenerateSuccess: {
    id: 'certificates.regenerate.success',
    defaultMessage: 'Certificate regeneration has been started',
    description: 'Success message for certificate regeneration',
  },
  regenerateError: {
    id: 'certificates.regenerate.error',
    defaultMessage: 'Error regenerating certificates',
    description: 'Error message for certificate regeneration',
  },
  close: {
    id: 'certificates.close',
    defaultMessage: 'Close',
    description: 'Close button text',
  },
  regenerateAllLearnersMessage: {
    id: 'certificates.regenerate.modal.allLearners',
    defaultMessage: 'Regenerate certificates for all learners who have received certificates.',
    description: 'Modal message for regenerating certificates for received filter',
  },
  regenerateNotReceivedMessage: {
    id: 'certificates.regenerate.modal.notReceived',
    defaultMessage: 'Generate certificates for learners who have not yet received certificates.',
    description: 'Modal message for regenerating certificates for not received filter',
  },
  regenerateAuditPassingMessage: {
    id: 'certificates.regenerate.modal.auditPassing',
    defaultMessage: 'Generate certificates for audit learners who are passing.',
    description: 'Modal message for regenerating certificates for audit passing filter',
  },
  regenerateAuditNotPassingMessage: {
    id: 'certificates.regenerate.modal.auditNotPassing',
    defaultMessage: 'Generate certificates for audit learners who are not passing.',
    description: 'Modal message for regenerating certificates for audit not passing filter',
  },
  regenerateErrorMessage: {
    id: 'certificates.regenerate.modal.error',
    defaultMessage: 'Regenerate certificates for learners whose certificate generation resulted in an error.',
    description: 'Modal message for regenerating certificates for error filter',
  },
  generateExceptionsMessage: {
    id: 'certificates.regenerate.modal.exceptions',
    defaultMessage: 'Generate certificates for learners who have been granted exceptions.',
    description: 'Modal message for generating certificates for granted exceptions filter',
  },
  regenerateCertificatesTitle: {
    id: 'certificates.regenerate.modal.title',
    defaultMessage: 'Regenerate Certificates',
    description: 'Modal title for regenerating certificates',
  },
  generateCertificatesTitle: {
    id: 'certificates.generate.modal.title',
    defaultMessage: 'Generate Certificates',
    description: 'Modal title for generating certificates',
  },
  regenerateConfirmation: {
    id: 'certificates.regenerate.modal.confirmation',
    defaultMessage: '{action} certificates for {number} learners?',
    description: 'Confirmation message for regenerating/generating certificates',
  },
  cancel: {
    id: 'certificates.cancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button text',
  },
  regenerate: {
    id: 'certificates.regenerate',
    defaultMessage: 'Regenerate',
    description: 'Regenerate button text',
  },
  generate: {
    id: 'certificates.generate',
    defaultMessage: 'Generate',
    description: 'Generate button text',
  },
});

export default messages;
