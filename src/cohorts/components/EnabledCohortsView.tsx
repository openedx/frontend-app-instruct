import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { FormControl, Button, Card, Alert } from '@openedx/paragon';
import { CheckCircle } from '@openedx/paragon/icons';
import messages from '../messages';
import { useCohorts, useCreateCohort } from '../data/apiHook';
import CohortsForm from './CohortsForm';
import { useCohortContext } from './CohortContext';
import { CohortData } from '../types';
import { assignmentTypes } from '../constants';
import SelectedCohortInfo from './SelectedCohortInfo';

const EnabledCohortsView = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const { data = [] } = useCohorts(courseId);
  const { mutate: createCohort } = useCreateCohort(courseId);
  const { clearSelectedCohort, selectedCohort, setSelectedCohort } = useCohortContext();
  const [displayAddForm, setDisplayAddForm] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const cohortsList = [{ id: 'null', name: intl.formatMessage(messages.selectCohortPlaceholder) }, ...data];

  const handleAddCohort = () => {
    clearSelectedCohort();
    setShowSuccessAlert(false);
    setDisplayAddForm(true);
  };

  const handleSelectCohort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setShowSuccessAlert(false);
    const selectedValue = event.target.value;
    const selectedCohortFromApi = cohortsList.find(cohort => cohort.id?.toString() === selectedValue);
    setDisplayAddForm(false);

    if (selectedCohortFromApi && selectedCohortFromApi.id !== 'null') {
      const cohortFormData: CohortData = {
        id: selectedCohortFromApi.id,
        name: selectedCohortFromApi.name,
        assignmentType: selectedCohortFromApi.assignmentType ?? assignmentTypes.automatic,
        groupId: selectedCohortFromApi.groupId,
        userPartitionId: selectedCohortFromApi.userPartitionId,
      };
      setSelectedCohort(cohortFormData);
    } else {
      clearSelectedCohort();
    }
  };

  const handleNewCohort = (newCohort: Partial<CohortData>) => {
    createCohort(newCohort, {
      onSuccess: (newCohort: CohortData) => {
        setShowSuccessAlert(true);
        setSelectedCohort(newCohort);
        hideAddForm();
      },
      onError: (error) => console.error(error)
    });
  };

  const hideAddForm = () => {
    setDisplayAddForm(false);
  };

  return (
    <>
      <div className="d-flex mt-4.5">
        <FormControl placeholder="Select a cohort" name="cohort" as="select" onChange={handleSelectCohort} value={selectedCohort?.id?.toString() ?? 'null'} disabled={displayAddForm}>
          {
            cohortsList.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))
          }
        </FormControl>
        <Button onClick={handleAddCohort} disabled={displayAddForm}>+ {intl.formatMessage(messages.addCohort)}</Button>
      </div>
      {showSuccessAlert && <Alert className="mt-3" icon={CheckCircle} variant="success">{intl.formatMessage(messages.addCohortSuccessMessage, { cohortName: selectedCohort?.name })}</Alert>}
      {displayAddForm && (
        <Card className="mt-3 bg-light-200">
          <CohortsForm disableManualAssignment={data.length === 0} onCancel={hideAddForm} onSubmit={handleNewCohort} />
        </Card>
      )}
      {selectedCohort && <SelectedCohortInfo />}
    </>
  );
};

export default EnabledCohortsView;
