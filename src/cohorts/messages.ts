import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  cohortsTitle: {
    id: 'instruct.cohorts.title',
    defaultMessage: 'Cohorts',
    description: 'Title for the cohorts page'
  },
  addCohort: {
    id: 'instruct.cohorts.addCohort',
    defaultMessage: 'Add Cohort',
    description: 'Button label for adding a new cohort'
  },
  disableMessage: {
    id: 'instruct.cohorts.disableModal.disableMessage',
    defaultMessage: 'Disable Cohorts? Disabling cohorts while a course is in progress will cause an unexpected change for your learners.',
    description: 'Message displayed in the disable cohorts confirmation modal'
  },
  cancelLabel: {
    id: 'instruct.cohorts.disableModal.cancelLabel',
    defaultMessage: 'Cancel',
    description: 'Label for the cancel button in the disable cohorts modal'
  },
  disableLabel: {
    id: 'instruct.cohorts.disableModal.disableLabel',
    defaultMessage: 'Disable',
    description: 'Label for the disable button in the disable cohorts modal'
  },
  noCohortsMessage: {
    id: 'instruct.cohorts.noCohortsMessage',
    defaultMessage: 'You can use Cohorts to create smaller communities in your course, or to design different course experiences for different groups of learners.',
    description: 'Message displayed when there are no cohorts'
  },
  learnMore: {
    id: 'instruct.cohorts.learnMore',
    defaultMessage: 'Learn more',
    description: 'Label for the learn more link'
  },
  enableCohorts: {
    id: 'instruct.cohorts.enableCohorts',
    defaultMessage: 'Enable Cohorts',
    description: 'Label for the enable cohorts button'
  },
  disableCohorts: {
    id: 'instruct.cohorts.disableCohorts',
    defaultMessage: 'Disable Cohorts',
    description: 'Label for the disable cohorts button'
  },
  selectCohortPlaceholder: {
    id: 'instruct.cohorts.selectCohortPlaceholder',
    defaultMessage: 'Select a cohort',
    description: 'Placeholder text for the select cohort dropdown'
  }
});

export default messages;
