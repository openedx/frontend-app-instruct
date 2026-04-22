import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, ButtonGroup, Card } from '@openedx/paragon';
import messages from './messages';
import Allowances from './components/Allowances';
import AttemptsList from './components/AttemptsList';

const SpecialExamsPage = () => {
  const intl = useIntl();
  const [selectedTab, setSelectedTab] = useState<'attempts' | 'allowances'>('attempts');

  return (
    <>
      <h3 className="text-primary-700">{intl.formatMessage(messages.specialExamsTitle)}</h3>
      <Card className="bg-light-200 mt-4.5">
        <ButtonGroup className="d-block mx-4 mt-4">
          <Button variant={selectedTab === 'attempts' ? 'primary' : 'outline-primary'} onClick={() => setSelectedTab('attempts')}>{intl.formatMessage(messages.examAttempts)}</Button>
          <Button variant={selectedTab === 'allowances' ? 'primary' : 'outline-primary'} onClick={() => setSelectedTab('allowances')}>{intl.formatMessage(messages.allowances)}</Button>
        </ButtonGroup>
        {
          selectedTab === 'attempts' ? <AttemptsList /> : <Allowances />
        }
      </Card>
    </>
  );
};

export default SpecialExamsPage;
