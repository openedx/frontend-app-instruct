import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, ButtonGroup, Card } from '@openedx/paragon';
import { PendingTasks } from '@src/components/PendingTasks';
import GradingActionRow from '@src/grading/components/GradingActionRow';
import GradingLearnerContent from '@src/grading/components/GradingLearnerContent';
import messages from '@src/grading/messages';
import { GradingToolsType } from '@src/grading/types';

const GradingPage = () => {
  const intl = useIntl();
  const [selectedTools, setSelectedTools] = useState<GradingToolsType>('single');
  const [isPendingTasksOpen, setIsPendingTasksOpen] = useState(false);

  const handleOpenPendingTasks = () => {
    setIsPendingTasksOpen(true);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-primary-700 mb-0">{intl.formatMessage(messages.pageTitle)}</h3>
        <GradingActionRow />
      </div>
      <Card className="bg-light-200 p-4 mt-4.5">
        <ButtonGroup className="d-block">
          <Button
            onClick={() => setSelectedTools('single')}
            variant={selectedTools === 'single' ? 'primary' : 'outline-primary'}
          >
            {intl.formatMessage(messages.singleLearner)}
          </Button>
          <Button
            onClick={() => setSelectedTools('all')}
            variant={selectedTools === 'all' ? 'primary' : 'outline-primary'}
          >
            {intl.formatMessage(messages.allLearners)}
          </Button>
        </ButtonGroup>
        <GradingLearnerContent toolType={selectedTools} onShowTasks={handleOpenPendingTasks} />
      </Card>
      <PendingTasks isOpen={isPendingTasksOpen} onToggle={() => setIsPendingTasksOpen(prev => !prev)} />
    </>
  );
};

export default GradingPage;
