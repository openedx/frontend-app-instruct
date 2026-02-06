import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, ButtonGroup, Card } from '@openedx/paragon';
import SingleLearnerContent from './components/SingleLearnerContent';
import AllLearnersContent from './components/AllLearnersContent';
import messages from './messages';
import GradingActionRow from './components/GradingActionRow';

const GradingPage = () => {
  const intl = useIntl();
  const [selectedTools, setSelectedTools] = useState('single');

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-primary-700">{intl.formatMessage(messages.pageTitle)}</h3>
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
        {selectedTools === 'single' ? <SingleLearnerContent /> : <AllLearnersContent />}
      </Card>
    </>
  );
};

export default GradingPage;
