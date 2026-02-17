import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl } from '@openedx/paragon';
import messages from '../messages';
import SpecifyProblemField from '../../components/SpecifyProblemField';
import ActionCard, { ActionCardProps } from '@src/components/ActionCard';
import SpecifyLearnerField from '@src/components/SpecifyLearnerField';
import { GradingToolsType } from '../types';
import { useLearnerGrading, useProblemDetails } from '../data/apiHook';

interface GradingLearnerContentProps {
  toolType: GradingToolsType,
}

const GradingLearnerContent = ({ toolType }: GradingLearnerContentProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [blockId, setBlockId] = useState('');
  const [score, setScore] = useState('');
  const { data: learnerGradingData = {}, isLoading } = useLearnerGrading(courseId, emailOrUsername);
  const { data: problemDetailsData } = useProblemDetails(courseId, blockId, emailOrUsername);

  // { fullName, email, gradebookUrl, progressUrl, username }
  console.log('Learner grading data:', learnerGradingData);
  console.log('Problem details data:', problemDetailsData);

  const singleLearnerActionRows: ActionCardProps[] = [
    {
      title: intl.formatMessage(messages.resetAttempts),
      description: intl.formatMessage(messages.resetAttemptsDescription),
      buttonLabel: intl.formatMessage(messages.resetAttemptsButtonLabel),
      onButtonClick: () => console.log('Reset attempts for learner')
    },
    {
      title: intl.formatMessage(messages.rescoreSubmission),
      description: intl.formatMessage(messages.rescoreSubmissionDescription),
      customAction: (
        <div className="d-flex flex-column gap-3">
          <Button>{intl.formatMessage(messages.rescoreSubmissionButtonLabel)}</Button>
          <Button>{intl.formatMessage(messages.rescoreIfImprovesScoreButtonLabel)}</Button>
        </div>
      ),
    },
    {
      title: intl.formatMessage(messages.overrideScore),
      description: intl.formatMessage(messages.overrideScoreDescription),
      buttonLabel: intl.formatMessage(messages.overrideScoreButtonLabel),
      customAction: (
        <div className="d-flex align-items-center gap-2">
          <FormControl
            placeholder={intl.formatMessage(messages.overrideScorePlaceholder)}
            value={score}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScore(e.target.value)}
          />
          <Button>{intl.formatMessage(messages.overrideScoreButtonLabel)}</Button>
        </div>
      )
    },
    {
      title: intl.formatMessage(messages.deleteHistory),
      description: intl.formatMessage(messages.deleteHistoryDescription),
      customAction: (
        <div className="d-flex flex-column gap-3">
          <Button>{intl.formatMessage(messages.resetAttemptsButtonLabel)}</Button>
          <Button>{intl.formatMessage(messages.deleteHistoryButtonLabel)}</Button>
        </div>
      ),
    },
    {
      title: intl.formatMessage(messages.taskStatus),
      description: intl.formatMessage(messages.taskStatusDescription),
      buttonLabel: intl.formatMessage(messages.taskStatusButtonLabel),
      onButtonClick: () => console.log('Check task status for learner')
    }
  ];

  const allLearnersActionRows = [];

  const rows = toolType === 'single' ? singleLearnerActionRows : allLearnersActionRows;

  const handleProblemChange = (location: string): void => {
    setBlockId(location);
    console.log('Problem specified for report generation', location);
  };

  const handleLearnerChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailOrUsername(event.target.value);
    console.log('Learner specified:', event.target.value);
  };

  return (
    <>
      <p className="x-small text-primary mt-3">
        {
          toolType === 'single'
            ? intl.formatMessage(messages.descriptionSingleLearner)
            : intl.formatMessage(messages.descriptionAllLearners)
        }
      </p>
      <div className="d-flex justify-content-between gap-4">
        {toolType === 'single' && (
          <div className="w-50">
            <SpecifyLearnerField onChange={handleLearnerChange} />
          </div>
        )}
        <div className="w-50">
          <SpecifyProblemField
            fieldLabel={intl.formatMessage(messages.specifyProblem)}
            buttonLabel={intl.formatMessage(messages.select)}
            disabled={isLoading}
            onClick={handleProblemChange}
          />
        </div>
      </div>
      {
        rows.map(({ title, description, buttonLabel, customAction, onButtonClick }, index) => (
          <ActionCard key={title} buttonLabel={buttonLabel} description={description} title={title} hasBorderBottom={index !== rows.length - 1} customAction={customAction} onButtonClick={onButtonClick} />
        ))
      }
    </>
  );
};

export default GradingLearnerContent;
