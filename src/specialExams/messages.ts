import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  specialExamsTitle: {
    id: 'instruct.specialExams.title',
    defaultMessage: 'Special Exams',
    description: 'Title for the special exams page'
  },
  examAttempts: {
    id: 'instruct.specialExams.examAttempts',
    defaultMessage: 'Exam Attempts',
    description: 'Label for the exam attempts tab'
  },
  allowances: {
    id: 'instruct.specialExams.allowances',
    defaultMessage: 'Allowances',
    description: 'Label for the allowances tab'
  },
  username: {
    id: 'instruct.specialExams.username',
    defaultMessage: 'Username',
    description: 'Column header for username in exam attempts list',
  },
  examName: {
    id: 'instruct.specialExams.examName',
    defaultMessage: 'Exam Name',
    description: 'Column header for exam name in exam attempts list',
  },
  timeLimit: {
    id: 'instruct.specialExams.timeLimit',
    defaultMessage: 'Time Limit',
    description: 'Column header for time limit in exam attempts list',
  },
  type: {
    id: 'instruct.specialExams.type',
    defaultMessage: 'Type',
    description: 'Column header for type in exam attempts list',
  },
  startedAt: {
    id: 'instruct.specialExams.startedAt',
    defaultMessage: 'Started At',
    description: 'Column header for started at in exam attempts list',
  },
  completedAt: {
    id: 'instruct.specialExams.completedAt',
    defaultMessage: 'Completed At',
    description: 'Column header for completed at in exam attempts list',
  },
  status: {
    id: 'instruct.specialExams.status',
    defaultMessage: 'Status',
    description: 'Column header for status in exam attempts list',
  },
  noAttempts: {
    id: 'instruct.specialExams.noAttempts',
    defaultMessage: 'No exam attempts found',
    description: 'Message displayed when there are no exam attempts to show',
  }
});

export default messages;
