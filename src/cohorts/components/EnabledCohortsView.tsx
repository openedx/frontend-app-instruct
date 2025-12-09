import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { FormControl, Button } from '@openedx/paragon';
import messages from '../messages';
import { useCohorts } from '../data/apiHook';

const EnabledCohortsView = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const { data = [] } = useCohorts(courseId);

  const cohortsList = [{ id: null, name: intl.formatMessage(messages.selectCohortPlaceholder) }, ...data];

  const handleAddCohort = () => {
    // Handle adding a new cohort
    console.log('Add Cohort');
  };

  const handleSelectCohort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Handle cohort selection
    console.log(event);
  };

  return (
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
  );
};

export default EnabledCohortsView;
