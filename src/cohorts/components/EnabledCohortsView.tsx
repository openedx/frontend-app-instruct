import { useIntl } from '@openedx/frontend-base';
import { FormControl, Button } from '@openedx/paragon';
import messages from '../messages';

interface EnabledCohortsViewProps {
  cohortsList: { id: string, name: string }[],
}

const EnabledCohortsView = ({ cohortsList }: EnabledCohortsViewProps) => {
  const intl = useIntl();

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
