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
});

export default messages;
