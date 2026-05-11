import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  forbiddenErrorHeading: {
    id: 'instructorDashboard.forbiddenError.heading',
    defaultMessage: 'Access Denied',
    description: 'Heading for the forbidden access error message',
  },
  forbiddenErrorMessage: {
    id: 'instructorDashboard.forbiddenError.message',
    defaultMessage: 'You do not have permission to access this content. Please contact the administrator if you believe this is an error.',
    description: 'Message displayed when user lacks permission to access content',
  },
  unauthorizedErrorHeading: {
    id: 'instructorDashboard.unauthorizedError.heading',
    defaultMessage: 'Unauthorized',
    description: 'Heading for the unauthorized access error message',
  },
  unauthorizedErrorMessage: {
    id: 'instructorDashboard.unauthorizedError.message',
    defaultMessage: 'You must be logged in and have instructor permissions to view this content.',
    description: 'Message displayed when user is not authenticated or lacks instructor permissions',
  },
  genericErrorHeading: {
    id: 'instructorDashboard.genericError.heading',
    defaultMessage: 'Something went wrong',
    description: 'Heading for a generic server error message',
  },
  genericErrorMessage: {
    id: 'instructorDashboard.genericError.message',
    defaultMessage: 'An unexpected error occurred. Please try again later.',
    description: 'Message displayed when an unexpected server error occurs',
  },
});

export default messages;
