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
});

export default messages;
