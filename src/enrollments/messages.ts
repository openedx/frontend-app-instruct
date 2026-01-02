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
    description: 'Button label for enrolling learners',
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
    id: 'instruct.enrollments.checkEnrollmentStatusModal.addLearnerInstructions',
    defaultMessage: 'Learner’s My Open edX email address or username',
    description: 'Instructions for enroll learners to the course',
  },
  enrollLearnersPlaceholder: {
    id: 'instruct.enrollments.checkEnrollmentStatusModal.enrollLearnersPlaceholder',
    defaultMessage: 'Learner email address or username',
    description: 'Placeholder text for enrolling learners textarea',
  },
  closeButton: {
    id: 'instruct.enrollments.checkEnrollmentStatusModal.closeButton',
    defaultMessage: 'Close',
    description: 'Label for close button in modals',
  },
  statusResponseMessage: {
    id: 'instruct.enrollments.checkEnrollmentStatusModal.statusResponseMessage',
    defaultMessage: 'Enrollment status for {learnerIdentifier}: {status}',
    description: 'Message displaying the enrollment status for a learner',
  }
});

export default messages;
