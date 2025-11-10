import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  dateExtensionsTitle: {
    id: 'instruct.dateExtensions.page.title',
    defaultMessage: 'Viewing Granted Extensions',
    description: 'Title for date extensions page',
  },
  addIndividualExtension: {
    id: 'instruct.dateExtensions.page.addIndividualExtension',
    defaultMessage: 'Add Individual Extension',
    description: 'Button text for adding an individual date extension',
  },
  username: {
    id: 'instruct.dateExtensions.page.tableHeader.username',
    defaultMessage: 'User Name',
    description: 'Label for the user name column in the date extensions table',
  },
  fullname: {
    id: 'instruct.dateExtensions.page.tableHeader.fullname',
    defaultMessage: 'Full Name',
    description: 'Label for the full name column in the date extensions table',
  },
  email: {
    id: 'instruct.dateExtensions.page.tableHeader.email',
    defaultMessage: 'Email',
    description: 'Label for the email column in the date extensions table',
  },
  gradedSubsection: {
    id: 'instruct.dateExtensions.page.tableHeader.gradedSubsection',
    defaultMessage: 'Graded Subsection',
    description: 'Label for the graded subsection column in the date extensions table',
  },
  extendedDueDate: {
    id: 'instruct.dateExtensions.page.tableHeader.extendedDueDate',
    defaultMessage: 'Extended Due Date',
    description: 'Label for the extended due date column in the date extensions table',
  },
  reset: {
    id: 'instruct.dateExtensions.page.tableHeader.reset',
    defaultMessage: 'Reset',
    description: 'Label for the reset column in the date extensions table',
  },
  resetExtensions: {
    id: 'instruct.dateExtensions.page.button.resetExtensions',
    defaultMessage: 'Reset Extensions',
    description: 'Button text for resetting date extensions for a user',
  },
  resetConfirmationHeader: {
    id: 'instruct.dateExtensions.page.resetModal.confirmationHeader',
    defaultMessage: 'Reset extensions for {username}?',
    description: 'Header for the reset confirmation modal',
  },
  resetConfirmationMessage: {
    id: 'instruct.dateExtensions.page.resetModal.confirmationMessage',
    defaultMessage: 'Resetting a problem\'s due date rescinds a due date extension for a student on a particular subsection. This will revert the due date for the student back to the problem\'s original due date.',
    description: 'Confirmation message for resetting extensions in the reset modal',
  },
  cancel: {
    id: 'instruct.dateExtensions.page.resetModal.cancel',
    defaultMessage: 'Cancel',
    description: 'Label for the cancel button in the reset modal',
  },
  confirm: {
    id: 'instruct.dateExtensions.page.resetModal.confirm',
    defaultMessage: 'Reset Due Date for Student',
    description: 'Label for the confirm button in the reset modal',
  },
  close: {
    id: 'instruct.dateExtensions.page.resetModal.close',
    defaultMessage: 'Close',
    description: 'Label for the close button in the reset modal',
  },
});

export default messages;
