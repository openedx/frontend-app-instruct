import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({

  enrollmentSummaryTitle: {
    id: 'instruct.courseInfo.enrollmentSummary.title',
    defaultMessage: 'Course Enrollment',
    description: 'Title for the enrollment summary section',
  },
  allEnrollmentsLabel: {
    id: 'instruct.courseInfo.enrollmentSummary.allEnrollments',
    defaultMessage: 'All Enrollments',
    description: 'Label for all enrollments count',
  },
  staffAndAdminsLabel: {
    id: 'instruct.courseInfo.enrollmentSummary.staffAndAdmins',
    defaultMessage: 'Staff / Admin',
    description: 'Label for staff and admins count',
  },
  learnersLabel: {
    id: 'instruct.courseInfo.enrollmentSummary.learners',
    defaultMessage: 'Learners',
    description: 'Label for learners count',
  },
  verifiedLabel: {
    id: 'instruct.courseInfo.enrollmentSummary.verified',
    defaultMessage: 'Verified',
    description: 'Label for verified enrollments count',
  },
  auditLabel: {
    id: 'instruct.courseInfo.enrollmentSummary.audit',
    defaultMessage: 'Audit',
    description: 'Label for audit enrollments count',
  },
});

export default messages;
