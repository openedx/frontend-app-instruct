import { useIntl } from '@openedx/frontend-base';
import { IconButton } from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useCohorts, useDisableCohorts, useEnableCohorts } from '../data/apiHook';
import DisableCohortsModal from './components/DisableCohortsModal';
import messages from './messages';
import DisabledCohortsView from './components/DisabledCohortsView';
import EnabledCohortsView from './components/EnabledCohortsView';

// const list = [{ id: 'Select a cohort', name: 'Select a cohort' }, {
//   id: 'Cohort 1',
//   name: 'cohort1'
// }];

const CohortsPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const { data: cohortsList = [] } = useCohorts(courseId);
  const { mutate: enableCohortsMutate } = useEnableCohorts(courseId);
  const { mutate: disableCohortsMutate } = useDisableCohorts(courseId);
  const [isOpenDisableModal, setIsOpenDisableModal] = useState(false);

  const handleEnableCohorts = () => {
    try {
      enableCohortsMutate();
    } catch (error) {
      // Handle error
    }
  };

  const handleDisableCohorts = () => {
    try {
      disableCohortsMutate();
      setIsOpenDisableModal(false);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="mt-4.5 mb-4 mx-4">
      <div className="d-inline-flex align-items-center">
        <h3 className="mb-0">{intl.formatMessage(messages.cohortsTitle)}</h3>
        {cohortsList.length > 0 && (
          <div className="small">
            <IconButton iconAs={Settings} alt={intl.formatMessage(messages.disableCohorts)} variant="secondary" size="sm" onClick={() => setIsOpenDisableModal(true)} iconClassNames="mb-2" />
          </div>
        )}
      </div>
      {cohortsList.length > 0 ? (
        <EnabledCohortsView cohortsList={cohortsList} />
      ) : (
        <DisabledCohortsView onEnableCohorts={handleEnableCohorts} />
      )}
      <DisableCohortsModal isOpen={isOpenDisableModal} onClose={() => setIsOpenDisableModal(false)} onConfirmDisable={handleDisableCohorts} />
    </div>
  );
};

export default CohortsPage;
