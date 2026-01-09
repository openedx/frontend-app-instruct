import { useIntl } from '@openedx/frontend-base';
import { IconButton } from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useCohortStatus, useToggleCohorts } from './data/apiHook';
import DisableCohortsModal from './components/DisableCohortsModal';
import messages from './messages';
import DisabledCohortsView from './components/DisabledCohortsView';
import EnabledCohortsView from './components/EnabledCohortsView';
import { CohortProvider, useCohortContext } from './components/CohortContext';

const CohortsPageContent = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const { data: cohortStatus } = useCohortStatus(courseId);
  const { mutate: toggleCohortsMutate } = useToggleCohorts(courseId);
  const [isOpenDisableModal, setIsOpenDisableModal] = useState(false);
  const { clearSelectedCohort } = useCohortContext();
  const { isCohorted = false } = cohortStatus ?? {};

  const handleEnableCohorts = () => {
    toggleCohortsMutate({ isCohorted: true },
      {
        onError: (error) => console.log(error)
      });
  };

  const handleDisableCohorts = () => {
    toggleCohortsMutate({ isCohorted: false },
      {
        onSuccess: () => clearSelectedCohort(),
        onError: (error) => console.log(error)
      });
    setIsOpenDisableModal(false);
  };

  return (
    <div className="mt-4.5 mb-4 mx-4">
      <div className="d-inline-flex align-items-center">
        <h3 className="mb-0 text-gray-700">{intl.formatMessage(messages.cohortsTitle)}</h3>
        {isCohorted && (
          <div className="small">
            <IconButton
              alt={intl.formatMessage(messages.disableCohorts)}
              iconAs={Settings}
              iconClassNames="mb-2 text-gray-500"
              size="sm"
              variant="secondary"
              onClick={() => setIsOpenDisableModal(true)}
            />
          </div>
        )}
      </div>
      {isCohorted ? (
        <EnabledCohortsView />
      ) : (
        <DisabledCohortsView onEnableCohorts={handleEnableCohorts} />
      )}
      <DisableCohortsModal isOpen={isOpenDisableModal} onClose={() => setIsOpenDisableModal(false)} onConfirmDisable={handleDisableCohorts} />
    </div>
  );
};

// It was necessary to wrap the entire content with CohortProvider here to avoid errors in the use of cohort hooks within a provider
const CohortsPage = () => {
  return (
    <CohortProvider>
      <CohortsPageContent />
    </CohortProvider>
  );
};

export default CohortsPage;
