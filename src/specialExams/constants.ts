import messages from '@src/specialExams/messages';

export const ALLOWANCES_PAGE_SIZE = 25;

export const addLabel = {
  additional_time_granted: messages.addAdditionalTimeGranted,
  review_policy_exception: messages.addReviewPolicyException,
  time_multiplier: messages.addTimeMultiplier,
};

export const addPlaceholder = {
  additional_time_granted: messages.addTimePlaceholder,
  review_policy_exception: messages.exceptionPlaceholder,
  time_multiplier: messages.timeMultiplierPlaceholder,
};

export const allowanceTypesOptions = [
  { value: '', label: messages.allowanceType },
  { value: 'additional_time_granted', label: messages.additionalTime },
  { value: 'review_policy_exception', label: messages.reviewPolicy },
  { value: 'time_multiplier', label: messages.timeMultiplier },
];
