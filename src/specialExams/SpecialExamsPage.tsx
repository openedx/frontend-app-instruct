import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, ButtonGroup, Card } from '@openedx/paragon';
import messages from './messages';
import Allowances from './components/Allowances';
import AttemptsList from './components/AttemptsList';

const SPECIAL_EXAMS_TAB = {
  ATTEMPTS: 'attempts',
  ALLOWANCES: 'allowances',
};

const SpecialExamsPage = () => {
  const intl = useIntl();
  const [selectedTab, setSelectedTab] = useState<(typeof SPECIAL_EXAMS_TAB)[keyof typeof SPECIAL_EXAMS_TAB]>(SPECIAL_EXAMS_TAB.ATTEMPTS);

  return (
    <>
      <h3 className="text-primary-700">{intl.formatMessage(messages.specialExamsTitle)}</h3>
      <Card className="bg-light-200 mt-4.5">
        <ButtonGroup className="d-block mx-4 mt-4">
          <Button
            variant={selectedTab === SPECIAL_EXAMS_TAB.ATTEMPTS ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedTab(SPECIAL_EXAMS_TAB.ATTEMPTS)}
          >{intl.formatMessage(messages.examAttempts)}
          </Button>
          <Button
            variant={selectedTab === SPECIAL_EXAMS_TAB.ALLOWANCES ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedTab(SPECIAL_EXAMS_TAB.ALLOWANCES)}
          >{intl.formatMessage(messages.allowances)}
          </Button>
        </ButtonGroup>
        {
          selectedTab === SPECIAL_EXAMS_TAB.ATTEMPTS ? <AttemptsList /> : <Allowances />
        }
      </Card>
    </>
  );
};

export default SpecialExamsPage;
