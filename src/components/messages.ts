import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  select: {
    id: 'instruct.specifyLearner.select',
    defaultMessage: 'Select',
    description: 'Label for select dropdown in specify learner field',
  },
  specifyLearner: {
    id: 'instruct.specifyLearner.label',
    defaultMessage: 'Specify Learner:',
    description: 'Label for specify learner field',
  },
  specifyLearnerPlaceholder: {
    id: 'instruct.specifyLearner.placeholder',
    defaultMessage: 'Learner email address or username',
    description: 'Placeholder text for specify learner input field',
  },
  noRecordsFoundHeader: {
    id: 'instruct.dataDownloads.noRecordsFound.header',
    defaultMessage: 'No records found',
    description: 'Header displayed when no records are found in a table',
  },
  noRecordsFoundBody: {
    id: 'instruct.dataDownloads.noRecordsFound.body',
    defaultMessage: 'There are currently no records to display.',
    description: 'Body text displayed when no records are found in a table',
  },
  pageNotFoundHeader: {
    id: 'instruct.pageNotFound.header',
    defaultMessage: 'Page not found',
    description: 'Header for page not found error',
  },
  pageNotFoundBody: {
    id: 'instruct.pageNotFound.body',
    defaultMessage: 'The page you were looking for was not found.',
    description: 'Body text for page not found error',
  },
});

export default messages;
