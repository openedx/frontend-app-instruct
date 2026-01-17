import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  enrollmentsPageTitle: {
    id: 'instruct.enrollments.page.title',
    defaultMessage: 'Enrollment Management',
    description: 'Title for the enrollments page',
  },
  addBetaTesters: {
    id: 'instruct.enrollments.addBetaTesters',
    defaultMessage: 'Add Beta Testers',
    description: 'Button label for adding beta testers',
  },
  enrollLearners: {
    id: 'instruct.enrollments.enrollLearners',
    defaultMessage: 'Enroll Learners',
    description: 'Button label an modal title for enrolling learners',
  },
  checkEnrollmentStatus: {
    id: 'instruct.enrollments.checkEnrollmentStatus',
    defaultMessage: 'Check Enrollment Status',
    description: 'Check enrollment status modal title and alt for icon button',
  },
  username: {
    id: 'instruct.enrollments.username',
    defaultMessage: 'Username',
    description: 'Column header for username in enrollments list',
  },
  fullName: {
    id: 'instruct.enrollments.fullName',
    defaultMessage: 'Name',
    description: 'Column header for full name in enrollments list',
  },
  email: {
    id: 'instruct.enrollments.email',
    defaultMessage: 'Email',
    description: 'Column header for email in enrollments list',
  },
  track: {
    id: 'instruct.enrollments.track',
    defaultMessage: 'Track',
    description: 'Column header for track in enrollments list',
  },
  betaTester: {
    id: 'instruct.enrollments.betaTester',
    defaultMessage: 'Beta Tester',
    description: 'Column header for beta tester status in enrollments list',
  },
  actions: {
    id: 'instruct.enrollments.actions',
    defaultMessage: 'Actions',
    description: 'Column header for actions in enrollments list',
  },
  unenrollButton: {
    id: 'instruct.enrollments.unenrollButton',
    defaultMessage: 'Unenroll',
    description: 'Button label for unenrolling a learner',
  },
  trueLabel: {
    id: 'instruct.enrollments.trueLabel',
    defaultMessage: 'True',
    description: 'Label for true boolean value',
  },
  addLearnerInstructions: {
    id: 'instruct.enrollments.modals.checkEnrollmentStatus.addLearnerInstructions',
    defaultMessage: 'Learner’s My Open edX email address or username',
    description: 'Instructions for enroll learners to the course',
  },
  enrollmentStatusPlaceholder: {
    id: 'instruct.enrollments.modals.checkEnrollmentStatus.enrollmentStatusPlaceholder',
    defaultMessage: 'Learner email address or username',
    description: 'Placeholder text for enrolling learners textarea',
  },
  closeButton: {
    id: 'instruct.enrollments.modals.closeButton',
    defaultMessage: 'Close',
    description: 'Label for close button in modals',
  },
  statusResponseMessage: {
    id: 'instruct.enrollments.modals.checkEnrollmentStatus.statusResponseMessage',
    defaultMessage: 'Enrollment status for {learnerIdentifier}: {status}',
    description: 'Message displaying the enrollment status for a learner',
  },
  userIdentifierPlaceholder: {
    id: 'instruct.enrollments.modals.enrollLearners.userIdentifierPlaceholder',
    defaultMessage: 'Email addresses / Usernames',
    description: 'Placeholder text for enrolling learners textarea',
  },
  enrollLearnerInstructions: {
    id: 'instruct.enrollments.modals.enrollLearners.enrollLearnerInstructions',
    defaultMessage: 'Enter email addresses and/or usernames separated by new lines or commas. You will not get notification for emails that bounce, so please double-check spelling.',
    description: 'Instructions for enrolling learners to the course',
  },
  unenrollLearners: {
    id: 'instruct.enrollments.modals.unenrollLearners',
    defaultMessage: 'Unenroll Learners',
    description: 'Title for unenroll learners modal',
  },
  unenrollLearnersConfirmation: {
    id: 'instruct.enrollments.modals.unenrollLearnersConfirmation',
    defaultMessage: 'Unenroll {name} from course?',
    description: 'Confirmation message for unenrolling learners',
  },
  unenrollLearnerTitle: {
    id: 'instruct.enrollments.modals.unenrollLearnerTitle',
    defaultMessage: 'Unenroll Learner?',
    description: 'Title for unenroll learner modal',
  },
  saveButton: {
    id: 'instruct.enrollments.modals.saveButton',
    defaultMessage: 'Save',
    description: 'Label for save button in modals',
  },
  cancelButton: {
    id: 'instruct.enrollments.modals.cancelButton',
    defaultMessage: 'Cancel',
    description: 'Label for cancel button in modals',
  },
  autoEnrollCheckbox: {
    id: 'instruct.enrollments.modals.autoEnrollCheckbox',
    defaultMessage: 'Auto Enroll',
    description: 'Label for auto enroll checkbox in enroll learners modal',
  },
  notifyUsersCheckbox: {
    id: 'instruct.enrollments.modals.notifyUsersCheckbox',
    defaultMessage: 'Notify Users by Email',
    description: 'Label for notify users by email checkbox in enroll learners modal',
  },
  addBetaTestersInstructions: {
    id: 'instruct.enrollments.modals.addBetaTesters.addBetaTestersInstructions',
    defaultMessage: 'Enter email addresses and/or usernames separated by new lines or commas. Note: Users must have an activated My Open edX account before they can be enrolled as beta testers.',
    description: 'Instructions for adding beta testers to the course',
  },
  uploadCSV: {
    id: 'instruct.enrollments.modals.uploadCSV',
    defaultMessage: 'Upload CSV',
    description: 'Title for upload CSV tab in add modal',
  },
});

export default messages;
