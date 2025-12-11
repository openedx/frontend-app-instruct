import { useIntl } from '@openedx/frontend-base';
import { useParams } from 'react-router-dom';
import CohortCard from './CohortCard';
import messages from '../messages';
import dataDownloadsMessages from '../../dataDownloads/messages';

interface SelectedCohortInfoProps {
  selectedCohort: any,
}

const SelectedCohortInfo = ({ selectedCohort }: SelectedCohortInfoProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  console.log('Selected Cohort Info for cohort:', selectedCohort, 'in course:', courseId);

  if (!selectedCohort) {
    return null;
  }

  return (
    <>
      <CohortCard />
      <p className="mt-3">{intl.formatMessage(messages.cohortDisclaimer)} <a href="/">{intl.formatMessage(dataDownloadsMessages.pageTitle)}</a> {intl.formatMessage(messages.page)}</p>
    </>
  );
};

export default SelectedCohortInfo;
