import { useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { FormattedMessage, getExternalLinkUrl, useIntl } from '@openedx/frontend-base';
import { Card, Tab, Tabs, Toast } from '@openedx/paragon';
import messages from '../messages';
import CohortsForm from './CohortsForm';
import ManageLearners from './ManageLearners';
import { useCohortContext } from './CohortContext';
import { usePatchCohort } from '../data/apiHook';
import { CohortData } from '../types';

const assignmentLink = {
  random: 'https://docs.openedx.org/en/latest/educators/references/advanced_features/managing_cohort_assignment.html#about-auto-cohorts',
  manual: 'https://docs.openedx.org/en/latest/educators/how-tos/advanced_features/manage_cohorts.html#assign-learners-to-cohorts-manually',
};

const warningMessage = {
  random: messages.automaticCohortWarning,
  manual: messages.manualCohortWarning,
};

const CohortCard = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { selectedCohort, setSelectedCohort } = useCohortContext();
  const { mutate: editCohort } = usePatchCohort(courseId);
  const formRef = useRef<{ resetForm: () => void }>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  if (!selectedCohort) {
    return null;
  }

  const handleEditCohort = (updatedCohort: CohortData) => {
    editCohort({ cohortId: selectedCohort.id, cohortInfo: updatedCohort },
      {
        onSuccess: () => {
          setShowSuccessMessage(true);
          setSelectedCohort({ ...selectedCohort, ...updatedCohort });
        },
        onError: (error) => console.error(error)
      }
    );
  };

  const handleCancelForm = () => {
    formRef.current?.resetForm();
  };

  return (
    <>
      <Card className="bg-light-200 mt-3">
        <div className="mx-4 my-3.5">
          <div className="d-flex align-items-center">
            <h3 className="text-primary-700 mb-0">{selectedCohort?.name}</h3>
            <p className="ml-3 text-primary-700 mb-0">{intl.formatMessage(messages.studentsOnCohort, { users: selectedCohort?.userCount ?? 0 })}</p>
          </div>
          <p className="x-small mb-0 mt-2">
            <FormattedMessage {...warningMessage[selectedCohort.assignmentType]} /> <a href={getExternalLinkUrl(assignmentLink[selectedCohort.assignmentType])}>{intl.formatMessage(messages.warningCohortLink)}</a>
          </p>
        </div>
        <Tabs id="cohort-management-tabs" className="mx-0" onSelect={() => {}}>
          <Tab key="manage-learners" eventKey="manage-learners" title={intl.formatMessage(messages.manageLearners)}>
            <ManageLearners />
          </Tab>
          <Tab key="settings" eventKey="settings" title={intl.formatMessage(messages.settings)}>
            <CohortsForm
              ref={formRef}
              onCancel={handleCancelForm}
              onSubmit={handleEditCohort}
            />
          </Tab>
        </Tabs>
      </Card>
      <Toast show={showSuccessMessage} onClose={() => setShowSuccessMessage(false)} className="text-break">
        {intl.formatMessage(messages.cohortUpdateSuccessMessage)}
      </Toast>
    </>
  );
};

export default CohortCard;
