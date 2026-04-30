import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl } from '@openedx/paragon';
import ActionCard, { ActionCardProps } from '@src/components/ActionCard';
import SpecifyLearnerField from '@src/components/SpecifyLearnerField';
import SpecifyProblemField from '@src/components/SpecifyProblemField';
import { useChangeScore, useDeleteHistory, useRescoreSubmission, useResetAttempts } from '@src/grading/data/apiHook';
import messages from '@src/grading/messages';
import { GradingToolsType } from '@src/grading/types';
import { usePendingTasks } from '@src/data/apiHook';

interface GradingLearnerContentProps {
  toolType: GradingToolsType,
  onShowTasks: () => void,
}

const GradingLearnerContent = ({ toolType, onShowTasks }: GradingLearnerContentProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [blockId, setBlockId] = useState('');
  const [score, setScore] = useState('');
  const learnerFieldRef = useRef<{ reset: () => void }>(null);
  const problemFieldRef = useRef<{ reset: () => void }>(null);

  const { mutate: resetAttempts } = useResetAttempts(courseId);
  const { mutate: deleteHistory } = useDeleteHistory(courseId);
  const { mutate: changeScore } = useChangeScore(courseId);
  const { mutate: rescoreSubmission } = useRescoreSubmission(courseId);
  const { refetch: refetchTasks } = usePendingTasks(courseId);

  const handleResetAttempts = (): void => {
    resetAttempts({ learner: usernameOrEmail, problem: blockId });
  };

  const handleRescoreSubmission = (onlyIfHigher = false): void => {
    rescoreSubmission({ learner: usernameOrEmail, problem: blockId, onlyIfHigher });
  };

  const handleDeleteHistory = (): void => {
    deleteHistory({ learner: usernameOrEmail, problem: blockId });
  };

  const handleOverrideScore = (): void => {
    changeScore({ learner: usernameOrEmail, problem: blockId, newScore: Number(score) });
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const numericRegex = /^-?\d*\.?\d*$/;

    if (numericRegex.test(value) || value === '') {
      setScore(value);
    }
  };

  const handleTaskStatusClick = (): void => {
    refetchTasks();
    onShowTasks();
  };

  useEffect(() => {
    setUsernameOrEmail('');
    setBlockId('');
    setScore('');
    learnerFieldRef.current?.reset();
    problemFieldRef.current?.reset();
  }, [toolType]);

  const singleLearnerActionRows: ActionCardProps[] = [
    {
      title: intl.formatMessage(messages.resetAttempts),
      description: intl.formatMessage(messages.resetAttemptsDescription),
      customAction: (
        <Button disabled={!usernameOrEmail || !blockId} onClick={handleResetAttempts}>
          {intl.formatMessage(messages.resetAttemptsButtonLabel)}
        </Button>
      )
    },
    {
      title: intl.formatMessage(messages.rescoreSubmission),
      description: intl.formatMessage(messages.rescoreSubmissionDescription),
      customAction: (
        <div className="d-flex flex-column gap-3">
          <Button disabled={!usernameOrEmail || !blockId} onClick={() => handleRescoreSubmission()}>{intl.formatMessage(messages.rescoreSubmissionButtonLabel)}</Button>
          <Button disabled={!usernameOrEmail || !blockId} onClick={() => handleRescoreSubmission(true)}>{intl.formatMessage(messages.rescoreIfImprovesScoreButtonLabel)}</Button>
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
            name={intl.formatMessage(messages.overrideScorePlaceholder)}
            type="number"
            placeholder={intl.formatMessage(messages.overrideScorePlaceholder)}
            value={score}
            onChange={handleScoreChange}
          />
          <Button disabled={!usernameOrEmail || !blockId || !score} onClick={handleOverrideScore}>{intl.formatMessage(messages.overrideScoreButtonLabel)}</Button>
        </div>
      )
    },
    {
      title: intl.formatMessage(messages.deleteHistory),
      description: intl.formatMessage(messages.deleteHistoryDescription),
      customAction: (
        <div className="d-flex flex-column gap-3">
          <Button disabled={!usernameOrEmail || !blockId} onClick={handleDeleteHistory}>{intl.formatMessage(messages.deleteHistoryButtonLabel)}</Button>
        </div>
      ),
    },
    {
      title: intl.formatMessage(messages.taskStatus),
      description: intl.formatMessage(messages.taskStatusDescription),
      customAction: (
        <Button disabled={!usernameOrEmail || !blockId} onClick={handleTaskStatusClick}>
          {intl.formatMessage(messages.taskStatusButtonLabel)}
        </Button>
      )
    }
  ];

  const allLearnersActionRows = [
    {
      title: intl.formatMessage(messages.resetAttempts),
      description: intl.formatMessage(messages.resetAllLearnersAttemptsDescription),
      buttonLabel: intl.formatMessage(messages.resetAttemptsButtonLabel),
      customAction: (
        <Button disabled={!blockId} onClick={handleResetAttempts}>
          {intl.formatMessage(messages.resetAttemptsButtonLabel)}
        </Button>
      )
    },
    {
      title: intl.formatMessage(messages.rescoreSubmission),
      description: intl.formatMessage(messages.rescoreSubmissionAllLearnersDescription),
      customAction: (
        <div className="d-flex flex-column gap-3">
          <Button disabled={!blockId} onClick={() => handleRescoreSubmission()}>{intl.formatMessage(messages.rescoreAllSubmissionButtonLabel)}</Button>
          <Button disabled={!blockId} onClick={() => handleRescoreSubmission(true)}>{intl.formatMessage(messages.rescoreIfImprovesScoreButtonLabel)}</Button>
        </div>
      ),
    },
    {
      title: intl.formatMessage(messages.taskStatus),
      description: intl.formatMessage(messages.taskStatusDescription),
      customAction: (
        <Button onClick={handleTaskStatusClick}>
          {intl.formatMessage(messages.taskStatusButtonLabel)}
        </Button>
      )
    }
  ];

  const rows = toolType === 'single' ? singleLearnerActionRows : allLearnersActionRows;

  const handleProblemChange = (location: string): void => {
    setBlockId(location);
  };

  const handleLearnerChange = (usernameOrEmail: string): void => {
    setUsernameOrEmail(usernameOrEmail);
    // Reset problem field when learner changes due to progress and attempts change for every learner
    setBlockId('');
    problemFieldRef.current?.reset();
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
            <SpecifyLearnerField ref={learnerFieldRef} onClickSelect={handleLearnerChange} />
          </div>
        )}
        <div className="w-50">
          <SpecifyProblemField
            ref={problemFieldRef}
            fieldLabel={intl.formatMessage(messages.specifyProblem)}
            buttonLabel={intl.formatMessage(messages.select)}
            disabled={!usernameOrEmail && toolType === 'single'}
            usernameOrEmail={usernameOrEmail}
            onClickSelect={handleProblemChange}
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
