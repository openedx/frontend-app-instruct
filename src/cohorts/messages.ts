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
  },
  cohortName: {
    id: 'instruct.cohorts.cohortName',
    defaultMessage: 'Cohort Name',
    description: 'Label for the cohort name input field'
  },
  saveLabel: {
    id: 'instruct.cohorts.saveLabel',
    defaultMessage: 'Save',
    description: 'Label for the save button'
  },
  cohortAssignmentMethod: {
    id: 'instruct.cohorts.addForm.cohortAssignmentMethod',
    defaultMessage: 'Cohort Assignment Method',
    description: 'Label for the cohort assignment method section'
  },
  automatic: {
    id: 'instruct.cohorts.addForm.automatic',
    defaultMessage: 'Automatic',
    description: 'Label for the automatic cohort assignment method option'
  },
  manual: {
    id: 'instruct.cohorts.addForm.manual',
    defaultMessage: 'Manual',
    description: 'Label for the manual cohort assignment method option'
  },
  associatedContentGroup: {
    id: 'instruct.cohorts.addForm.associatedContentGroup',
    defaultMessage: 'Associated Content Group',
    description: 'Label for the associated content group section'
  },
  noContentGroup: {
    id: 'instruct.cohorts.addForm.noContentGroup',
    defaultMessage: 'No Content Group',
    description: 'Label for the no content group option'
  },
  selectAContentGroup: {
    id: 'instruct.cohorts.addForm.selectAContentGroup',
    defaultMessage: 'Select a Content Group',
    description: 'Label for the select a content group option'
  },
  notSelected: {
    id: 'instruct.cohorts.addForm.notSelected',
    defaultMessage: 'Not Selected',
    description: 'Label for the not selected content group option'
  },
  noContentGroups: {
    id: 'instruct.cohorts.addForm.noContentGroups',
    defaultMessage: 'No content groups exist.',
    description: 'Message displayed when there are no content groups'
  },
  createContentGroup: {
    id: 'instruct.cohorts.addForm.createContentGroup',
    defaultMessage: 'Create a content group',
    description: 'Label for the create a content group link'
  },
  addCohortSuccessMessage: {
    id: 'instruct.cohorts.addForm.successMessage',
    defaultMessage: 'The {cohortName} cohort has been created. You can manually add students to this cohort below.',
    description: 'Success message displayed when a new cohort is added'
  },
});

export default messages;
