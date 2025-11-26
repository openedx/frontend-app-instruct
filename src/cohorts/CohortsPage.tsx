import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl, IconButton } from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useCohorts, useDisableCohorts, useEnableCohorts } from '../data/apiHook';
import DisableCohortsModal from './components/DisableCohortsModal';
import messages from './messages';

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

  const handleSelectCohort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Handle cohort selection
    console.log(event);
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
          <Button>+ {intl.formatMessage(messages.addCohort)}</Button>
        </div>
      ) : (
        <div className="d-flex bg-light-200 border border-light-400 p-5 mt-4.5 align-items-center">
          <p className="m-0">
            {intl.formatMessage(messages.noCohortsMessage)} <a href="https://openedx.atlassian.net/wiki/spaces/ENG/pages/123456789/Cohorts+Feature+Documentation">{intl.formatMessage(messages.learnMore)}</a>
          </p>
          <Button className="ml-3 flex-shrink-0" onClick={handleEnableCohorts}>{intl.formatMessage(messages.enableCohorts)}</Button>
        </div>
      )}
      <DisableCohortsModal isOpen={isOpenDisableModal} onClose={() => setIsOpenDisableModal(false)} onConfirmDisable={handleDisableCohorts} />
    </div>
  );
};

export default CohortsPage;
