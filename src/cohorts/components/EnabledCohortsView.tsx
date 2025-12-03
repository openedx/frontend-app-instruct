import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { FormControl, Button, Card } from '@openedx/paragon';
import messages from '../messages';
import { useCohorts } from '../data/apiHook';
import CohortsForm from './CohortsForm';

const EnabledCohortsView = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const { data = [] } = useCohorts(courseId);
  const [displayAddForm, setDisplayAddForm] = useState(false);

  const cohortsList = [{ id: null, name: intl.formatMessage(messages.selectCohortPlaceholder) }, ...data];

  const handleAddCohort = () => {
    setDisplayAddForm(true);
  };

  const handleSelectCohort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Handle cohort selection
    console.log(event);
  };

  const handleNewCohort = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('New cohort created', event);
    // Logic to handle new cohort creation goes here
    hideAddForm();
  };

  const hideAddForm = () => {
    setDisplayAddForm(false);
  };

  return (
    <>
      <div className="d-flex mt-4.5">
        <FormControl placeholder="Select a cohort" name="cohort" as="select" onChange={handleSelectCohort}>
          {
            cohortsList.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))
          }
        </FormControl>
        <Button onClick={handleAddCohort}>+ {intl.formatMessage(messages.addCohort)}</Button>
      </div>
      {displayAddForm && <Card className="mt-3 bg-light-200"><CohortsForm disableManualAssignment={data.length === 0} onCancel={hideAddForm} onSubmit={handleNewCohort} /></Card>}
    </>
  );
};

export default EnabledCohortsView;
