import { useIntl } from '@openedx/frontend-base';
import { Card, Tab, Tabs } from '@openedx/paragon';
import messages from '../messages';
import CohortsForm from './CohortsForm';
import ManageLearners from './ManageLearners';
import { useCohortContext } from './CohortContext';

const CohortCard = () => {
  const { selectedCohort } = useCohortContext();
  const intl = useIntl();

  return (
    <Card className="bg-light-200 mt-3">
      <div className="mx-4 my-3.5">
        <h3>{selectedCohort?.name}</h3>
      </div>
      <Tabs id="cohort-management-tabs" className="mx-0" onSelect={() => {}}>
        <Tab key="manage-learners" eventKey="manage-learners" title={intl.formatMessage(messages.manageLearners)}>
          <ManageLearners />
        </Tab>
        <Tab key="settings" eventKey="settings" title={intl.formatMessage(messages.settings)}>
          <CohortsForm
            onCancel={() => {}}
            onSubmit={() => {}}
          />
        </Tab>
      </Tabs>
    </Card>
  );
};

export default CohortCard;
