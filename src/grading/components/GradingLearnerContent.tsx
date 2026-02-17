import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';
import SpecifyProblem from '../../components/SpecifyProblem';
import ActionCard from '@src/components/ActionCard';
import SpecifyLearnerField from '@src/components/SpecifyLearnerField';
import { GradingToolsType } from '../types';

interface GradingLearnerContentProps {
  toolType: GradingToolsType,
}

const GradingLearnerContent = ({ toolType }: GradingLearnerContentProps) => {
  const intl = useIntl();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log('Learner specified:', event.target.value);
  };

  const singleLearnerActionRows = [
    {
      title: intl.formatMessage(messages.resetAttempts),
      description: intl.formatMessage(messages.resetAttemptsDescription),
      buttonLabel: intl.formatMessage(messages.resetAttemptsButtonLabel),
    },
    {
      title: intl.formatMessage(messages.rescoreSubmission),
      description: intl.formatMessage(messages.rescoreSubmissionDescription),
      buttonLabel: intl.formatMessage(messages.rescoreSubmissionButtonLabel),
    },
    {
      title: intl.formatMessage(messages.overrideScore),
      description: intl.formatMessage(messages.overrideScoreDescription),
      buttonLabel: intl.formatMessage(messages.overrideScoreButtonLabel),
    },
    {
      title: intl.formatMessage(messages.deleteHistory),
      description: intl.formatMessage(messages.deleteHistoryDescription),
      buttonLabel: intl.formatMessage(messages.deleteHistoryButtonLabel),
    },
    {
      title: intl.formatMessage(messages.taskStatus),
      description: intl.formatMessage(messages.taskStatusDescription),
      buttonLabel: intl.formatMessage(messages.taskStatusButtonLabel),
    }
  ];

  const allLearnersActionRows = [];

  const rows = toolType === 'single' ? singleLearnerActionRows : allLearnersActionRows;

  return (
    <>
      <p className="x-small text-primary mt-3">
        {
          toolType === 'single'
            ? intl.formatMessage(messages.descriptionSingleLearner)
            : intl.formatMessage(messages.descriptionAllLearners)
        }
      </p>
      <div className="d-flex justify-content-between">
        {toolType === 'single' && <SpecifyLearnerField onChange={handleChange} />}
        <SpecifyProblem />
      </div>
      {
        rows.map(({ title, description, buttonLabel }, index) => (
          <ActionCard key={title} buttonLabel={buttonLabel} description={description} title={title} hasBorderBottom={index !== rows.length - 1} />
        ))
      }
    </>
  );
};

export default GradingLearnerContent;
