import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  pageTitle: {
    id: 'instruct.grading.pageTitle',
    defaultMessage: 'Grading Tools',
    description: 'Title for the grading page'
  },
  configurationAlt: {
    id: 'instruct.grading.configurationAlt',
    defaultMessage: 'Grading Configuration and Settings',
    description: 'Alt text for the configuration icon button'
  },
  viewGradebook: {
    id: 'instruct.grading.viewGradebook',
    defaultMessage: 'View Gradebook',
    description: 'Text for the button to view the gradebook'
  },
  singleLearner: {
    id: 'instruct.grading.singleLearner',
    defaultMessage: 'Single Learner',
    description: 'Single Learner button label to display corresponding grading tools'
  },
  allLearners: {
    id: 'instruct.grading.allLearners',
    defaultMessage: 'All Learners',
    description: 'All learners button label to display corresponding grading tools'
  },
  descriptionSingleLearner: {
    id: 'instruct.grading.descriptionSingleLearner',
    defaultMessage: 'These grading tools allow for grade review and adjustment for a specific learner on a specific problem.',
    description: 'Description for single learner grading tools'
  },
  descriptionAllLearners: {
    id: 'instruct.grading.descriptionAllLearners',
    defaultMessage: 'These grading tools allow for grade review and adjustment all enrolled learners on a specific problem. ',
    description: 'Description for all learners grading tools'
  },
  gradingConfiguration: {
    id: 'instruct.grading.gradingConfiguration',
    defaultMessage: 'Grading Configuration',
    description: 'Title for the grading configuration modal'
  },
  close: {
    id: 'instruct.grading.modals.close',
    defaultMessage: 'Close',
    description: 'Text for the close button in the grading configuration modal'
  },
  viewGradingConfiguration: {
    id: 'instruct.grading.viewGradingConfiguration',
    defaultMessage: 'View Grading Configuration',
    description: 'View grading configuration menu item label'
  },
  viewCourseGradingSettings: {
    id: 'instruct.grading.viewCourseGradingSettings',
    defaultMessage: 'View Course Grading Settings',
    description: 'View course grading settings menu item label'
  },
  resetAttempts: {
    id: 'instruct.grading.resetAttempts',
    defaultMessage: 'Reset Attempts',
    description: 'Title for the reset attempts action card'
  },
  resetAttemptsDescription: {
    id: 'instruct.grading.resetAttemptsDescription',
    defaultMessage: 'Allow a learner who has used up all attempts to work on the problem again.',
    description: 'Description for the reset attempts action card'
  },
  resetAttemptsButtonLabel: {
    id: 'instruct.grading.resetAttemptsButtonLabel',
    defaultMessage: 'Reset Attempts to Zero',
    description: 'Button label for the reset attempts action card'
  },
  rescoreSubmission: {
    id: 'instruct.grading.rescoreSubmission',
    defaultMessage: 'Rescore Submission',
    description: 'Title for the rescore submission action card'
  },
  rescoreSubmissionDescription: {
    id: 'instruct.grading.rescoreSubmissionDescription',
    defaultMessage: 'For the specified problem, two tools exist for rescoring learner responses.',
    description: 'Description for the rescore submission action card'
  },
  rescoreSubmissionButtonLabel: {
    id: 'instruct.grading.rescoreSubmissionButtonLabel',
    defaultMessage: 'Rescore Learner\'s Submission',
    description: 'Button label for the rescore submission action card'
  },
  overrideScore: {
    id: 'instruct.grading.overrideScore',
    defaultMessage: 'Override Score',
    description: 'Title for the override score action card'
  },
  overrideScoreDescription: {
    id: 'instruct.grading.overrideScoreDescription',
    defaultMessage: 'For the specified problem, override the learner\'s score. Input the new score, out of the total points available for this problem.',
    description: 'Description for the override score action card'
  },
  overrideScoreButtonLabel: {
    id: 'instruct.grading.overrideScoreButtonLabel',
    defaultMessage: 'Override Learner\'s Score',
    description: 'Button label for the override score action card'
  },
  deleteHistory: {
    id: 'instruct.grading.deleteHistory',
    defaultMessage: 'Delete History',
    description: 'Title for the delete history action card'
  },
  deleteHistoryDescription: {
    id: 'instruct.grading.deleteHistoryDescription',
    defaultMessage: 'For the specified problem, permanently and completely delete the learner\'s answers and scores from the database.',
    description: 'Description for the delete history action card'
  },
  deleteHistoryButtonLabel: {
    id: 'instruct.grading.deleteHistoryButtonLabel',
    defaultMessage: 'Delete Learner\'s State',
    description: 'Button label for the delete history action card'
  },
  taskStatus: {
    id: 'instruct.grading.taskStatus',
    defaultMessage: 'Task Status',
    description: 'Title for the task status action card'
  },
  taskStatusDescription: {
    id: 'instruct.grading.taskStatusDescription',
    defaultMessage: 'Show the status for the tasks that you submitted for this problem.',
    description: 'Description for the task status action card'
  },
  taskStatusButtonLabel: {
    id: 'instruct.grading.taskStatusButtonLabel',
    defaultMessage: 'Show Task Status',
    description: 'Button label for the task status action card'
  },
  resetAllLearnersAttemptsDescription: {
    id: 'instruct.grading.resetAllLearnersAttemptsDescription',
    defaultMessage: 'Allows all learners to work on the problem again.',
    description: 'Description for the reset attempts action card in the all learners view'
  },
  rescoreSubmissionAllLearnersDescription: {
    id: 'instruct.grading.rescoreSubmissionAllLearnersDescription',
    defaultMessage: 'For the specified problem, rescore all learners\' responses.',
    description: 'Description for the rescore submission action card in the all learners view'
  }
});

export default messages;
